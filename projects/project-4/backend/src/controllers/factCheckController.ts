import { Request, Response } from 'express';
import { speechToTextService } from '../services/speech-to-text/speechToTextService';
import { llmService } from '../services/llm/llmService';
import { webSearchService } from '../services/web-search/webSearchService';
import { sliceAudio } from '../utils/audioSlicer';

export const factCheckController = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded.' });
  }

  try {
    // 1. Transcribe Audio to Text
    const transcript = await speechToTextService.transcribe(req.file.path);

    // 2. Identify Key Statements
    const statements = await llmService.identifyStatements(transcript.text);

    // 3. Fact-Check Each Statement
    const results = await Promise.all(
      statements.map(async (statement) => {
        // a. Perform Web Search
        const searchResults = await webSearchService.search(statement.text);

        // b. Verify Statement
        const verification = await llmService.verifyStatement(
          statement.text,
          searchResults
        );

        // c. Slice Audio for Replay
        const audioSlice = await sliceAudio(
          req.file.path,
          statement.startTime,
          statement.endTime
        );

        return {
          ...statement,
          ...verification,
          audioSlice,
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the fact-checking process.' });
  }
};
