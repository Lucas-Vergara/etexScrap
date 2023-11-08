import { Controller, Get } from '@nestjs/common';
import { exec } from 'child_process';

@Controller()
export class ScrapingController {

  @Get('/ejecutar-script')
  async ejecutarScript(): Promise<string> {
    return this.ejecutarSeleniumScript();
  }

  ejecutarSeleniumScript(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec('python ../selenium/main.py', (error, stdout) => {
        if (error) {
          console.error(`Error al ejecutar el script: ${error.message}`);
          reject(error.message);
          return;
        }
        console.log(`Script ejecutado con éxito: ${stdout}`);
        resolve(stdout);
      });
    });
  }
}
