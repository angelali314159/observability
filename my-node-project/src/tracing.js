const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
ConsoleMetricExporter,
PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
//Instrumentations
const { ExpressInstrumentation } =
require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  });
  const metricExporter = new OTLPMetricExporter({
    url: 'http://localhost:4318/v1/metrics', 
  });
  
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'todo-service',
    }),
    traceExporter: traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new ExpressInstrumentation(),
      new MongoDBInstrumentation(),
      new HttpInstrumentation(),
    ],
  });
sdk.start();
