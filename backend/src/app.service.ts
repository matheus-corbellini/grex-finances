import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Grex Finances Backend API - Ready for development! 🚀";
  }
}
