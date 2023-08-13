import http.server
import socketserver

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')  # 允许任何来源访问，仅用于演示
        super().end_headers()

PORT = 8080
Handler = MyHttpRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Server started at localhost:", PORT)
    httpd.serve_forever()