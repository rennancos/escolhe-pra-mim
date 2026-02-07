import { NextResponse } from "next/server";

export function ok(data = null, meta = null, init = {}) {
  return NextResponse.json(
    { success: true, data, meta },
    { status: 200, ...init }
  );
}

export function created(data = null, meta = null, init = {}) {
  return NextResponse.json(
    { success: true, data, meta },
    { status: 201, ...init }
  );
}

export function badRequest(message = "Bad Request", details = null) {
  return NextResponse.json(
    { success: false, error: { code: "BAD_REQUEST", message, details } },
    { status: 400 }
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message } },
    { status: 401 }
  );
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json(
    { success: false, error: { code: "FORBIDDEN", message } },
    { status: 403 }
  );
}

export function notFound(message = "Not Found") {
  return NextResponse.json(
    { success: false, error: { code: "NOT_FOUND", message } },
    { status: 404 }
  );
}

export function tooManyRequests(message = "Too Many Requests") {
  return NextResponse.json(
    { success: false, error: { code: "RATE_LIMITED", message } },
    { status: 429 }
  );
}

export function serverError(message = "Internal Server Error", details = null) {
  return NextResponse.json(
    { success: false, error: { code: "INTERNAL_ERROR", message, details } },
    { status: 500 }
  );
}

