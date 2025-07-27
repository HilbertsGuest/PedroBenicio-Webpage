import { exec } from 'child_process';

export const sliceAudio = (filePath: string, startTime: number, endTime: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputFilePath = `public/audio-slices/${Date.now()}.mp3`;
    const command = `ffmpeg -i ${filePath} -ss ${startTime} -to ${endTime} -c copy ${outputFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error slicing audio: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`ffmpeg stderr: ${stderr}`);
      }
      resolve(outputFilePath);
    });
  });
};
