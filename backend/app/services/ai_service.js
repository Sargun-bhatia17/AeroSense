import { spawn } from 'child_process';
import path from 'path';

const pythonScriptPath = path.resolve(process.cwd(), '..', 'ai-engine', 'inference', 'predict.py');

export const getBestTime = (persona, activity) => {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [pythonScriptPath, persona, activity]);

    let dataToSend = '';
    python.stdout.on('data', (data) => {
      dataToSend += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(new Error(`Error from python script: ${data}`));
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}`));
      }
      try {
        const result = JSON.parse(dataToSend);
        resolve(result);
      } catch (error) {
        reject(new Error('Failed to parse python script output.'));
      }
    });
  });
};
