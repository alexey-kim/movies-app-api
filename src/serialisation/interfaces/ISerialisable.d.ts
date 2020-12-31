export interface ISerialisable {
  toJSON(): object;
  toLoggingJSON(): object;
}
