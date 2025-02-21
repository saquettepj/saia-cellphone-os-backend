interface IBucketRepository {
  create(fileName: string, xmlContent: string): Promise<string>
}

export { IBucketRepository }
