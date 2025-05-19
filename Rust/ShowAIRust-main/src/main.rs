#![allow(non_ascii_idents)]

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::mysql::MySqlPool;
use dotenv::dotenv;
use std::env;

#[derive(Serialize, Deserialize)]
struct Message {
    content: String,
}

#[derive(Serialize, Deserialize)]
struct Article {
    title: String,
    link: String,
    description: String,
}

#[derive(Serialize, Deserialize)]
struct Articles {
    articles: Vec<Article>
}

// Thêm struct mới để xử lý thông tin phân trang
#[derive(Deserialize)]
struct Pagination {
    page: Option<i64>,
    per_page: Option<i64>,
}

#[derive(Serialize)]
struct PaginatedResponse {
    articles: Vec<Article>,
    total_items: i64,
    total_pages: i64,
    current_page: i64,
    per_page: i64,
}

async fn hello() -> impl Responder {
    HttpResponse::Ok()
        .content_type("text/plain; charset=utf-8")
        .body("Xin chào từ Rust API!")
}

async fn get_articles(
    db: web::Data<MySqlPool>,
    query: web::Query<Pagination>
) -> impl Responder {
    let page = query.page.unwrap_or(1);
    let per_page = query.per_page.unwrap_or(10);
    
    let total = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM articles"
    )
    .fetch_one(db.get_ref())
    .await
    .unwrap_or(0);

    let total_pages = (total as f64 / per_page as f64).ceil() as i64;

    // Sửa lại logic tính offset để lấy từ cuối lên
    let offset = if page > total_pages {
        0
    } else {
        total - (page * per_page)
    };

    let articles = sqlx::query_as!(
        Article,
        r#"
        SELECT title, link, description 
        FROM articles 
        ORDER BY id DESC
        LIMIT ? OFFSET ?
        "#,
        per_page,
        if offset < 0 { 0 } else { offset }  // Đảm bảo offset không âm
    )
    .fetch_all(db.get_ref())
    .await;

    match articles {
        Ok(articles) => HttpResponse::Ok().json(PaginatedResponse { 
            articles,  // Không cần reverse nữa vì đã ORDER BY DESC
            total_items: total,
            total_pages,
            current_page: page,
            per_page
        }),
        Err(_) => HttpResponse::InternalServerError().finish()
    }
}

async fn get_all_articles(
    db: web::Data<MySqlPool>
) -> impl Responder {
    let articles = sqlx::query_as!(
        Article,
        r#"
        SELECT title, link, description 
        FROM articles 
        ORDER BY id DESC
        "#
    )
    .fetch_all(db.get_ref())
    .await;

    match articles {
        Ok(articles) => HttpResponse::Ok().json(Articles { articles }),
        Err(_) => HttpResponse::InternalServerError().finish()
    }
}

async fn add_articles(
    articles: web::Json<Articles>,
    db: web::Data<MySqlPool>
) -> impl Responder {
    for article in &articles.articles {
        let result = sqlx::query!(
            "INSERT INTO articles (title, link, description) VALUES (?, ?, ?)",
            article.title,
            article.link,
            article.description
        )
        .execute(db.get_ref())
        .await;

        if result.is_err() {
            return HttpResponse::InternalServerError().finish();
        }
    }
    
    HttpResponse::Ok().finish()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load biến môi trường từ file .env
    dotenv().ok();
    
    // Đọc DATABASE_URL từ biến môi trường
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    // Kết nối database sử dụng URL từ biến môi trường
    let pool = MySqlPool::connect(&database_url)
        .await
        .expect("Không thể kết nối database");

    println!("Server đang chạy tại http://127.0.0.1:8080");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/", web::get().to(hello))
            .route("/articles", web::get().to(get_articles))
            .route("/articles/all", web::get().to(get_all_articles))
            .route("/articles", web::post().to(add_articles))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
