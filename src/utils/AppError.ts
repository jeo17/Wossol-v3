import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { z } from 'zod';

// Define the schema using zod
const AppErrorSchema = z.object({
  message: z.string().optional(),
  httpStatus: z.nativeEnum(StatusCodes),
  description: z.string().optional(),
});

type AppErrorInput = z.infer<typeof AppErrorSchema>;

export class AppError extends Error {
  public readonly httpStatus: number;
  public readonly description?: string;
  public readonly isOperational: boolean;

  constructor(input: AppErrorInput) {
    // Validate input using zod
    const parsedInput = AppErrorSchema.parse(input);

    // Destructure the validated input
    const { message, httpStatus, description } = parsedInput;

    // Use the provided message or the default message based on the status code
    const errorMessage = message || getReasonPhrase(httpStatus);

    // Call the parent constructor
    super(errorMessage);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype);

    // Assign properties
    this.httpStatus = httpStatus;
    this.description = description;

    // Capture stack trace
    Error.captureStackTrace(this);
  }
}
