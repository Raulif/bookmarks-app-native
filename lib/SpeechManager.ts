import * as Speech from 'expo-speech';

// Types and interfaces
interface SpeechManagerOptions {
  onPlay?: () => void;
  onStop?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export class SpeechManager {
  private options: Speech.SpeechOptions;
  private synth: typeof Speech;
  private chunks: string[];
  private currentChunk: number;
  private bugFixInterval: number;
  private chunkSize: number;

  constructor(options: SpeechManagerOptions = {}) {
    // Default options
    this.options = this._prepareOptions(options);
    this.chunkSize = Speech.maxSpeechInputLength;
    this.synth = Speech;
    this.chunks = [];
    this.currentChunk = 0;
    this.bugFixInterval = 0;
  }

  private _prepareOptions(options: SpeechManagerOptions) {
    const that = this;
    return {
      onStart: options?.onPlay,
      onStopped: () => {
        options.onStop && options?.onStop();
        that._clearBugFixInterval();
      },
      onDone: this._handleChunkEnd,
      onError: this._handleError,
      onPause: options?.onPause,
      onResume: options?.onResume,
      voice: 'en-US-language',
      language: 'en-US',
    };
  }

  // Split text into manageable chunks
  private _prepareChunks(text: string): number {
    const { chunkSize } = this;

    // Clear existing chunks
    this.chunks = [];
    this.currentChunk = 0;

    // Split by sentences to avoid cutting in the middle of a sentence
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    sentences.forEach((sentence) => {
      // If adding this sentence exceeds chunk size and we already have content,
      // push current chunk and start a new one
      if (
        currentChunk.length + sentence.length > chunkSize &&
        currentChunk.length > 0
      ) {
        this.chunks.push(currentChunk);
        currentChunk = '';
      }

      // If a single sentence exceeds chunk size, split it further
      if (sentence.length > chunkSize) {
        // If we have content in current chunk, push it first
        if (currentChunk.length > 0) {
          this.chunks.push(currentChunk);
          currentChunk = '';
        }

        // Split long sentence into chunks, trying to break at commas or spaces
        let remainingSentence = sentence;
        while (remainingSentence.length > chunkSize) {
          // Find a good breaking point
          let breakPoint = remainingSentence.lastIndexOf(',', chunkSize);
          if (breakPoint === -1 || breakPoint < chunkSize * 0.5) {
            breakPoint = remainingSentence.lastIndexOf(' ', chunkSize);
          }
          if (breakPoint === -1) breakPoint = chunkSize;

          this.chunks.push(remainingSentence.substring(0, breakPoint + 1));
          remainingSentence = remainingSentence.substring(breakPoint + 1);
        }

        currentChunk = remainingSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    });

    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      this.chunks.push(currentChunk);
    }

    return this.chunks.length;
  }

  private _handleError(e: Error) {
    console.error('SpeechManager error:', e);
    this._handleChunkEnd();
  }

  private _handleChunkEnd() {
    // If not paused and not the last chunk, continue to the next
    if (this.currentChunk < this.chunks.length - 1) {
      this.currentChunk++;
      this._speakCurrentChunk();
    }
  }

  private _speakCurrentChunk() {
    if (this.currentChunk < this.chunks.length) {
      this.synth.speak(this.chunks[this.currentChunk], this.options);
    }
  }

  private _setBugFixInterval() {
    this.bugFixInterval = setInterval(async () => {
      const isSpeaking = await this.synth.isSpeakingAsync();
      if (!isSpeaking) {
        clearInterval(this.bugFixInterval);
      } else {
        this.synth.pause();
        this.synth.resume();
      }
    }, 14000);
  }

  private _clearBugFixInterval() {
    if (this.bugFixInterval) {
      clearInterval(this.bugFixInterval);
    }
  }

  // PUBLIC METHODS

  // Start speaking the text
  public speak(text: string) {
    // Prepare the text
    const chunkCount = this._prepareChunks(text);
    if (chunkCount > 0) {
      this.currentChunk = 0;

      // Start speaking the first chunk
      this._speakCurrentChunk();
      this._setBugFixInterval();
    }
  }

  // Pause speech
  public pause() {
    this.synth.pause();
  }

  // Resume speech
  public resume() {
    this.synth.resume();
  }

  // Stop speech
  public stop() {
    this.synth.stop();
    this._clearBugFixInterval();
  }
  public async isSpeaking(): Promise<boolean> {
    return await this.synth.isSpeakingAsync();
  }
}
