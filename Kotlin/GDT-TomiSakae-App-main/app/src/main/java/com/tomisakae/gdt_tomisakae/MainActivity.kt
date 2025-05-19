package com.tomisakae.gdt_tomisakae

import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    
    // URL mặc định có thể thay đổi qua intent
    private var webUrl = "https://tomisakae.id.vn/"
    
    // Chế độ chơi game (online/offline)
    private var gameMode = MODE_ONLINE
    
    companion object {
        const val EXTRA_GAME_MODE = "com.tomisakae.gdt_tomisakae.EXTRA_GAME_MODE"
        const val EXTRA_URL = "com.tomisakae.gdt_tomisakae.EXTRA_URL"
        
        const val MODE_ONLINE = 1
        const val MODE_OFFLINE = 2
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Lấy thông tin từ intent (nếu có)
        intent?.let {
            gameMode = it.getIntExtra(EXTRA_GAME_MODE, MODE_ONLINE)
            it.getStringExtra(EXTRA_URL)?.let { url ->
                webUrl = url
            }
        }
        
        // Thiết lập chế độ toàn màn hình (phương pháp mới)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        val windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
        windowInsetsController.apply {
            hide(WindowInsetsCompat.Type.statusBars())
            hide(WindowInsetsCompat.Type.navigationBars())
            // Không ẩn IME (bàn phím) để cho phép nó hiển thị khi cần
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }
        
        // Thiết lập chế độ toàn màn hình (phương pháp cũ để đảm bảo tương thích)
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LOW_PROFILE)
        
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
        
        // Khởi tạo WebView
        webView = WebView(this)
        setContentView(webView)
        
        // Cấu hình WebView sử dụng WebViewHelper
        WebViewHelper.setupWebView(webView, this, webUrl)
        
        // Xử lý nút quay lại tùy thuộc vào chế độ chơi
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                when (gameMode) {
                    MODE_ONLINE -> {
                        // Trong chế độ online, không làm gì cả (vô hiệu hóa nút quay lại hoàn toàn)
                    }
                    MODE_OFFLINE -> {
                        // Trong chế độ offline, quay lại màn hình chọn chế độ
                        finish()
                    }
                }
            }
        })
    }
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            // Áp dụng lại chế độ toàn màn hình khi cửa sổ lấy lại focus
            // nhưng vẫn cho phép bàn phím hiển thị
            WindowCompat.getInsetsController(window, window.decorView).apply {
                hide(WindowInsetsCompat.Type.statusBars())
                hide(WindowInsetsCompat.Type.navigationBars())
                // Không ẩn IME (bàn phím) để cho phép nó hiển thị khi cần
                systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
            
            // Cách cũ để giữ cho UI ổn định với phương pháp cũ
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_LOW_PROFILE)
        }
    }
}