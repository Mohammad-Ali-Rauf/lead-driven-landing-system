declare module "sql.js" {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  interface Statement {
    bind(params?: any[]): boolean;
    step(): boolean;
    getAsObject(params?: object): Record<string, unknown>;
    free(): boolean;
    reset(): void;
  }

  interface Database {
    run(sql: string, params?: any[]): Database;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  export type { Database, Statement, QueryExecResult, SqlJsStatic, SqlJsConfig };

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
