import mysql.connector
from mysql.connector import Error

def create_connection(host_name, user_name, user_password, db_name=None):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Kết nối MySQL thành công")
    except Error as e:
        print(f"Lỗi: {e}")
    return connection

def create_database(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        print("Đã tạo cơ sở dữ liệu thành công")
    except Error as e:
        print(f"Lỗi: {e}")

def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Truy vấn thực hiện thành công")
    except Error as e:
        print(f"Lỗi: {e}")

def main():
    # Thông tin kết nối - thay đổi theo cài đặt của bạn
    host = "localhost"
    user = "root"
    password = "tomisakae0000"  # Thay đổi mật khẩu của bạn
    db_name = "priconne"
    
    # Kết nối đến MySQL server (không chỉ định cơ sở dữ liệu)
    connection = create_connection(host, user, password)
    
    # Tạo cơ sở dữ liệu
    create_database_query = f"CREATE DATABASE IF NOT EXISTS {db_name}"
    if connection:
        create_database(connection, create_database_query)
        connection.close()
    
    # Kết nối đến cơ sở dữ liệu mới tạo
    connection = create_connection(host, user, password, db_name)
    
    # Tạo bảng characters
    create_table_query = """
    CREATE TABLE IF NOT EXISTS characters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        avatar VARCHAR(255),
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50),
        rating_below_6_stars FLOAT,
        rating_6_stars FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    if connection:
        execute_query(connection, create_table_query)
        connection.close()
        print("Tạo cơ sở dữ liệu và bảng thành công!")

if __name__ == "__main__":
    main()
