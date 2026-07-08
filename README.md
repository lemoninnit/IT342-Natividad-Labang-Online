# RUN WEB
cd web
npm install axios react-router-dom
npm run dev

# RUN BACKEND
cd backend
mvn spring-boot:run

# RUN MOBILE
In mobile/app/src/main/java/edu/cit/natividad/serviline/api/ApiClient.kt
Change the SERVER_IP to your server's IP address
    private const val SERVER_IP = "<your current IPv4 address>"

