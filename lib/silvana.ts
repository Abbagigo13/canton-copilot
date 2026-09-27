// lib/silvana.ts
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_DIR = path.join(process.cwd(), "proto");

const packageDefinition = protoLoader.loadSync(
  path.join(PROTO_DIR, "silvana/ledger/v1/service.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [PROTO_DIR],
  }
);

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export const silvanaClient = new proto.silvana.ledger.v1.DAppProviderService(
  "orderbook-devnet.silvana.dev:443",
  grpc.credentials.createSsl()
);

export function callUnary<TReq, TRes>(
  method: string,
  request: TReq
): Promise<TRes> {
  return new Promise((resolve, reject) => {
    (silvanaClient as any)[method](request, (err: Error | null, res: TRes) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}