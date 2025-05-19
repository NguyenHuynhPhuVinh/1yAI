package com.tomisakae.gdt_tomisakae

import android.annotation.SuppressLint
import android.content.Context
import android.net.http.SslError
import android.view.MotionEvent
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

/**
 * Class hỗ trợ thiết lập WebView với các cấu hình cần thiết
 */
object WebViewHelper {
    
    /**
     * Cấu hình WebView với các thiết lập yêu cầu
     */
    @SuppressLint("SetJavaScriptEnabled", "AddJavascriptInterface", "ClickableViewAccessibility")
    fun setupWebView(webView: WebView, activity: ComponentActivity, url: String) {
        // Cấu hình WebView
        webView.settings.apply {
            // Bật JavaScript để hỗ trợ các trang web hiện đại
            javaScriptEnabled = true
            
            // Bật DOM Storage (localStorage)
            domStorageEnabled = true
            
            // Bật cơ sở dữ liệu
            databaseEnabled = true
            
            // Thiết lập chế độ desktop - User Agent cho desktop
            userAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
            
            // Cho phép truy cập tài nguyên từ bất kỳ nguồn nào
            allowContentAccess = true
            allowFileAccess = true
            
            // Cho phép chạy JavaScript từ các nguồn khác
            javaScriptCanOpenWindowsAutomatically = true
            
            // Cấu hình thu phóng - vô hiệu hóa các tính năng phóng to
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)  // Vô hiệu hóa tính năng phóng to
            builtInZoomControls = false  // Vô hiệu hóa điều khiển phóng to
            displayZoomControls = false
            
            // Cho phép WebView sử dụng bộ lưu đệm
            cacheMode = WebSettings.LOAD_DEFAULT
            
            // Bật HTTPS hỗ trợ
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

            // Cài đặt thêm để hiển thị giao diện desktop
            loadWithOverviewMode = true
            useWideViewPort = true
            
            // Tối ưu hiệu suất
            blockNetworkImage = false
            loadsImagesAutomatically = true
        }
        
        // Thiết lập tỷ lệ thu phóng 50% trực tiếp trên WebView
        webView.setInitialScale(50)
        
        // Thêm JavaScript để buộc giao diện Desktop và vô hiệu hóa phóng to
        val forceDesktopModeJS = """
            (function() {
                try {
                    // Thiết lập viewport cố định, không cho phép user-scalable
                    document.querySelector('meta[name="viewport"]').setAttribute('content', 
                        'width=1024, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
                } catch(e) {
                    console.log("Không tìm thấy meta viewport: " + e);
                    
                    // Tạo meta viewport nếu không tồn tại
                    var meta = document.createElement('meta');
                    meta.name = 'viewport';
                    meta.content = 'width=1024, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no';
                    document.getElementsByTagName('head')[0].appendChild(meta);
                }
                
                // Ngăn chặn các thao tác phóng to bằng cách chặn các sự kiện cảm ứng
                document.addEventListener('touchstart', function(e) {
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Ngăn chặn thao tác nhấn đúp để phóng to
                document.addEventListener('dblclick', function(e) {
                    e.preventDefault();
                }, { passive: false });
                
                // Ngăn chặn thu phóng bằng bánh xe chuột
                document.addEventListener('wheel', function(e) {
                    if (e.ctrlKey) {
                        e.preventDefault();
                    }
                }, { passive: false });
            })();
        """.trimIndent()
        
        // Thiết lập WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                return false // Tất cả URL sẽ được tải trong WebView
            }
            
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Ẩn các thanh hệ thống sau khi trang đã tải xong nhưng vẫn cho phép bàn phím
                hideSystemUIButAllowKeyboard(activity)
                
                // Chèn JavaScript để đảm bảo giao diện Desktop và vô hiệu hóa phóng to
                view?.evaluateJavascript(forceDesktopModeJS, null)
                
                // Đăng ký sự kiện focus cho trường nhập liệu
                view?.evaluateJavascript("""
                    (function() {
                        // Đăng ký sự kiện focus cho tất cả các input
                        document.addEventListener('focusin', function(e) {
                            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                                // Thông báo cho Android rằng một trường nhập liệu đã được focus
                                AndroidApp.notifyInputFocused();
                            }
                        });
                    })();
                """.trimIndent(), null)
            }
            
            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
                // Cho phép tiếp tục kể cả khi có lỗi SSL (chỉ nên dùng cho môi trường phát triển)
                handler?.proceed()
            }
        }
        
        // Thiết lập WebChromeClient
        webView.webChromeClient = CustomWebChromeClient(activity)
        
        // Thêm JavaScript Interface
        webView.addJavascriptInterface(AndroidJSInterface(activity), "AndroidApp")
        
        // Xử lý sự kiện chạm để ẩn các thanh hệ thống và vô hiệu hóa thao tác phóng to
        webView.setOnTouchListener { v, event ->
            when (event.action and MotionEvent.ACTION_MASK) {
                // Nếu có nhiều hơn 1 điểm chạm (multitouch) - vô hiệu hóa để ngăn chặn thu phóng
                MotionEvent.ACTION_POINTER_DOWN -> {
                    return@setOnTouchListener true
                }
                MotionEvent.ACTION_DOWN -> {
                    // Kiểm tra xem có phải là nhấn đúp không
                    val currentTime = System.currentTimeMillis()
                    if (currentTime - lastTapTime < DOUBLE_TAP_TIMEOUT) {
                        // Đây là nhấn đúp, ngăn chặn nó
                        lastTapTime = 0
                        return@setOnTouchListener true
                    }
                    lastTapTime = currentTime
                    
                    // Ẩn thanh hệ thống nhưng vẫn cho phép bàn phím hiển thị
                    hideSystemUIButAllowKeyboard(activity)
                }
            }
            // Trả về false cho các sự kiện khác để không cản trở nhấn thông thường
            false
        }
        
        // Cấu hình để có thể hiển thị bàn phím
        webView.isFocusable = true
        webView.isFocusableInTouchMode = true
        
        // Thêm header để yêu cầu phiên bản desktop
        webView.loadUrl(url, mapOf(
            "User-Agent" to "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
            "X-Requested-With" to "com.tomisakae.gdt_tomisakae",
            "Upgrade-Insecure-Requests" to "1",
            "Accept" to "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site" to "none",
            "Sec-Fetch-Mode" to "navigate",
            "Sec-Fetch-User" to "?1",
            "Sec-Fetch-Dest" to "document"
        ))
    }
    
    // Hằng số cho nhấn đúp
    private const val DOUBLE_TAP_TIMEOUT = 300L
    private var lastTapTime = 0L
    
    /**
     * Ẩn các thanh hệ thống nhưng vẫn cho phép bàn phím hiển thị
     */
    private fun hideSystemUIButAllowKeyboard(activity: ComponentActivity) {
        val controller = WindowCompat.getInsetsController(activity.window, activity.window.decorView)
        controller.apply {
            hide(WindowInsetsCompat.Type.statusBars())
            hide(WindowInsetsCompat.Type.navigationBars())
            // Không ẩn bàn phím
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }
        
        // Sử dụng API cũ để đảm bảo tương thích, nhưng giữ các cờ tương thích với bàn phím
        activity.window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
    }
    
    /**
     * Ẩn tất cả các thanh hệ thống bao gồm cả bàn phím
     */
    private fun hideSystemUI(activity: ComponentActivity) {
        // Sử dụng API mới để ẩn thanh hệ thống
        WindowCompat.getInsetsController(activity.window, activity.window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
        }
        
        // Sử dụng API cũ để đảm bảo tương thích
        activity.window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LOW_PROFILE)
    }
    
    /**
     * Hiển thị bàn phím ảo
     */
    private fun showKeyboard(view: View?, context: Context) {
        view?.let {
            it.requestFocus()
            val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
            imm?.showSoftInput(it, InputMethodManager.SHOW_IMPLICIT)
        }
    }
    
    /**
     * WebChromeClient tùy chỉnh để xử lý các tính năng JavaScript và UI
     */
    class CustomWebChromeClient(private val activity: ComponentActivity) : WebChromeClient() {
        
        override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
            // Có thể ghi log các thông báo console từ trang web
            return super.onConsoleMessage(consoleMessage)
        }
        
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            super.onProgressChanged(view, newProgress)
            // Có thể hiển thị thanh tiến trình nếu cần
        }
        
        override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
            super.onShowCustomView(view, callback)
            // Đảm bảo rằng chế độ toàn màn hình vẫn được duy trì khi hiển thị chế độ xem tùy chỉnh
            hideSystemUIButAllowKeyboard(activity)
        }
    }
    
    /**
     * JavaScript Interface để cho phép JavaScript trong trang web gọi các phương thức Android
     */
    class AndroidJSInterface(private val context: Context) {
        
        /**
         * Hiển thị thông báo Toast từ JavaScript
         * Gọi trong JavaScript: AndroidApp.showToast("Thông báo của bạn")
         */
        @JavascriptInterface
        fun showToast(message: String) {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
        
        /**
         * Lấy thông tin thiết bị từ Android
         * Gọi trong JavaScript: var deviceInfo = AndroidApp.getDeviceInfo()
         */
        @JavascriptInterface
        fun getDeviceInfo(): String {
            return "Android ${android.os.Build.VERSION.RELEASE}, Model: ${android.os.Build.MODEL}"
        }
        
        /**
         * Lưu dữ liệu vào SharedPreferences
         * Gọi trong JavaScript: AndroidApp.saveData("key", "value")
         */
        @JavascriptInterface
        fun saveData(key: String, value: String) {
            val sharedPref = context.getSharedPreferences("WebViewData", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString(key, value)
                apply()
            }
        }
        
        /**
         * Đọc dữ liệu từ SharedPreferences
         * Gọi trong JavaScript: var data = AndroidApp.getData("key", "default")
         */
        @JavascriptInterface
        fun getData(key: String, defaultValue: String): String {
            val sharedPref = context.getSharedPreferences("WebViewData", Context.MODE_PRIVATE)
            return sharedPref.getString(key, defaultValue) ?: defaultValue
        }
        
        /**
         * Được gọi khi một trường nhập liệu nhận focus
         */
        @JavascriptInterface
        fun notifyInputFocused() {
            // Đảm bảo bàn phím hiển thị khi trường nhập liệu được focus
            (context as? ComponentActivity)?.let { activity ->
                activity.runOnUiThread {
                    // Đảm bảo thanh trạng thái và thanh điều hướng ẩn
                    // nhưng vẫn cho phép bàn phím hiển thị
                    WindowCompat.getInsetsController(activity.window, activity.window.decorView).apply {
                        hide(WindowInsetsCompat.Type.statusBars())
                        hide(WindowInsetsCompat.Type.navigationBars())
                        // Không ẩn bàn phím nếu đang hiển thị
                        systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    }
                }
            }
        }
    }
}