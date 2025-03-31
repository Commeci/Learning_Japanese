import pymysql
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class MySQLDatabase:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MySQLDatabase, cls).__new__(cls)
        return cls._instance

    def __init__(self, host, user, password, database):
        if not hasattr(self, 'initialized'):
            self.host = host
            self.user = user
            self.password = password
            self.database = database
            self.connection = None
            self.initialized = True

    def connect(self):
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                cursorclass=pymysql.cursors.DictCursor
            )
            # print("Database connection successful")
        except pymysql.MySQLError as e:
            print(f"Error connecting to database: {e}")

    def close(self):
        if self.connection and self.connection.open:
            self.connection.close()
            # print("Database connection closed")

    def select(self, query, params=None):
        try:
            self.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
        except pymysql.MySQLError as e:
            print(f"Error executing select query: {e}")
            return None
        finally:
            self.close()

    def insert(self, query, params):
        try:
            self.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                self.connection.commit()
                print("Insert successful")
        except pymysql.MySQLError as e:
            print(f"Error executing insert query: {e}")
            self.connection.rollback()
        finally:
            self.close()

    def update(self, query, params):
        try:
            self.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                self.connection.commit()
                print("Update successful")
        except pymysql.MySQLError as e:
            print(f"Error executing update query: {e}")
            self.connection.rollback()
        finally:
            self.close()

    def delete(self, query, params):
        try:
            self.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                self.connection.commit()
                print("Delete successful")
        except pymysql.MySQLError as e:
            print(f"Error executing delete query: {e}")
            self.connection.rollback()
        finally:
            self.close()

# Load database credentials from environment variables
db = MySQLDatabase(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

# 사용 예시
if __name__ == "__main__":
    # Select 예시
    select_query = "SELECT * FROM users WHERE id = %s"
    result = db.select(select_query, (1,))
    print(result)

    # Insert 예시
    insert_query = "INSERT INTO users (name, email) VALUES (%s, %s)"
    db.insert(insert_query, ("John Doe", "john@example.com"))

    # Update 예시
    update_query = "UPDATE users SET email = %s WHERE id = %s"
    db.update(update_query, ("newemail@example.com", 1))

    # Delete 예시
    delete_query = "DELETE FROM users WHERE id = %s"
    db.delete(delete_query, (1,))

    db.close()
