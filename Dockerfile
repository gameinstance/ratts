# ----------- 1: Build Rust backend -----------
FROM rust:1.88-slim-bullseye AS backend-builder

RUN apt-get update && apt-get install -y libssl-dev pkg-config

WORKDIR /app/backend

COPY backend/Cargo.toml .
RUN mkdir src
RUN echo "fn main() {println!(\"RATTS dummy lib build !!!\")}" > src/main.rs
RUN cargo build --release && \
	echo "RATTS lib build complete."
RUN rm -rvf target/release/deps/ratts*
RUN mv -v ./Cargo.lock ./Cargo.lock.bk

COPY backend/ .
RUN mv -v ./Cargo.lock.bk ./Cargo.lock
RUN head src/main.rs
RUN cargo build --release && \
	echo "RATTS app build complete."

# NOTE: this counter-intuitive test helps rs_ts put TS types into ./bindings
RUN cargo test --release && \
	echo "Protocol TS types generation complete."


# ----------- 2: Build Angular frontend -----------
FROM node:20 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/ ./

RUN npm install

RUN mkdir -p ./src/protocol
COPY --from=backend-builder /app/backend/bindings ./src/protocol
RUN ls -lah ./src && ls -lah ./src/protocol

RUN npm run build -- --output-path=dist --configuration=production && \
	echo "Frontend app build (PROD) complete."


# ----------- 3: Runtime container -----------
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y libpq-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/backend/target/release/ratts .
COPY --from=frontend-builder /app/frontend/dist/browser ./static

CMD ["./ratts"]
