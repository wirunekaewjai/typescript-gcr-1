import { exec } from "child_process";

export async function execute(command: string) {
  await new Promise<void>((resolve) => {
    const proc = exec(command, (err) => {
      if (err) {
        throw err;
      }

      resolve();
    });
  
    proc.stderr?.pipe(process.stdout);
    proc.stdout?.pipe(process.stdout);
  });
}