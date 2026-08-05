import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { start, target } = await request.json();

    if (!start || !target) {
      return NextResponse.json(
        { success: false, error: 'Both start and target words are required.' },
        { status: 400 }
      );
    }

    const cleanStart = String(start).trim().toLowerCase();
    const cleanTarget = String(target).trim().toLowerCase();

    // Validate length (standard word length in dictionary is 4)
    if (cleanStart.length !== 4 || cleanTarget.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'Words must be exactly 4 letters long.' },
        { status: 400 }
      );
    }

    // Path to solver.py script located in root directory (one level up from frontend)
    const scriptPath = path.resolve(process.cwd(), '../solver.py');

    return new Promise<NextResponse>((resolve) => {
      // Escape inputs for safe execution
      const command = `python "${scriptPath}" "${cleanStart}" "${cleanTarget}"`;

      exec(command, { cwd: path.resolve(process.cwd(), '..') }, (error, stdout, stderr) => {
        if (error && !stdout) {
          console.error('Execution error:', error, stderr);
          return resolve(
            NextResponse.json(
              { success: false, error: 'Failed to execute solver script.' },
              { status: 500 }
            )
          );
        }

        try {
          const result = JSON.parse(stdout.trim());
          return resolve(NextResponse.json(result));
        } catch (parseError) {
          console.error('JSON Parse error:', parseError, stdout);
          return resolve(
            NextResponse.json(
              { success: false, error: 'Invalid response from solver.' },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
