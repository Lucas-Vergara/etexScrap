export class CreateBaseProductDto {
  readonly sku: string;
  readonly name: string;
  readonly brand: string;
  readonly distributor: string;
  readonly category: string;
  readonly region: string;
  readonly format: string;
}

export class UpdateBaseProductDto {
  readonly _id: string;
  readonly sku?: string;
  readonly name?: string;
  readonly brand?: string;
  readonly distributor?: string;
  readonly category?: string;
  readonly region?: string;
  readonly format?: string;
}

export class DeleteBaseProductDto {
  readonly _id: string;
}
