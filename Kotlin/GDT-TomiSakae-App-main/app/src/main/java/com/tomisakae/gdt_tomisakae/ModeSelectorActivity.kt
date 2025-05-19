package com.tomisakae.gdt_tomisakae

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.ComponentActivity
import androidx.cardview.widget.CardView

class ModeSelectorActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mode_selector)
        
        // Thiết lập chế độ toàn màn hình
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
        
        // Xử lý sự kiện khi nhấn vào card "Online"
        val onlineCardView = findViewById<CardView>(R.id.onlineCardView)
        onlineCardView.setOnClickListener {
            // Mở MainActivity với chế độ online
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra(MainActivity.EXTRA_GAME_MODE, MainActivity.MODE_ONLINE)
            intent.putExtra(MainActivity.EXTRA_URL, "https://tomisakae.id.vn/")
            startActivity(intent)
        }
        
        // Xử lý sự kiện khi nhấn vào card "Offline"
        val offlineCardView = findViewById<CardView>(R.id.offlineCardView)
        offlineCardView.setOnClickListener {
            // Mở MainActivity với chế độ offline
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra(MainActivity.EXTRA_GAME_MODE, MainActivity.MODE_OFFLINE)
            intent.putExtra(MainActivity.EXTRA_URL, "file:///android_asset/index.html")
            startActivity(intent)
        }
    }
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            // Áp dụng lại chế độ toàn màn hình khi cửa sổ lấy lại focus
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN)
        }
    }
} 