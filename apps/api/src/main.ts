import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix("api");

  const allowedOrigins = (
    config.get<string>("FRONTEND_URL") || "http://localhost:5173"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(config.get<string>("PORT")) || 3000;

  await app.listen(port, "0.0.0.0");

  console.log(`API đang chạy tại cổng ${port}`);
}

bootstrap();
