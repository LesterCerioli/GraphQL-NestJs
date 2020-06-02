import { Injectable } from '@nestjs/common';
import { BuildSchemaOptions } from '../interfaces';
import { EnumDefinitionFactory } from './factories/enum-definition.factory';
import { InputTypeDefinitionFactory } from './factories/input-type-definition.factory';
import { InterfaceDefinitionFactory } from './factories/interface-definition.factory';
import { ObjectTypeDefinitionFactory } from './factories/object-type-definition.factory';
import { UnionDefinitionFactory } from './factories/union-definition.factory';
import { TypeDefinitionsStorage } from './storages/type-definitions.storage';
import { TypeMetadataStorage } from './storages/type-metadata.storage';
import { MiddlewareStorage } from './storages/middleware.storage';

@Injectable()
export class TypeDefinitionsGenerator {
  constructor(
    private readonly typeDefinitionsStorage: TypeDefinitionsStorage,
    private readonly middlewareStorage: MiddlewareStorage,
    private readonly enumDefinitionFactory: EnumDefinitionFactory,
    private readonly inputTypeDefinitionFactory: InputTypeDefinitionFactory,
    private readonly objectTypeDefinitionFactory: ObjectTypeDefinitionFactory,
    private readonly interfaceDefinitionFactory: InterfaceDefinitionFactory,
    private readonly unionDefinitionFactory: UnionDefinitionFactory,
  ) {}

  generate(options: BuildSchemaOptions) {
    this.prepareMiddleware();
    this.generateUnionDefs();
    this.generateEnumDefs();
    this.generateInterfaceDefs(options);
    this.generateObjectTypeDefs(options);
    this.generateInputTypeDefs(options);
  }

  private prepareMiddleware() {
    const metadata = TypeMetadataStorage.getMiddlewarePropertyMetadata();

    metadata.forEach(({ middleware }) => {
      middleware.forEach((m) => {
        this.middlewareStorage.addMiddleware(m);
      });
    });
  }

  private generateInputTypeDefs(options: BuildSchemaOptions) {
    const metadata = TypeMetadataStorage.getInputTypesMetadata();
    const inputTypeDefs = metadata.map((metadata) =>
      this.inputTypeDefinitionFactory.create(metadata, options),
    );
    this.typeDefinitionsStorage.addInputTypes(inputTypeDefs);
  }

  private generateObjectTypeDefs(options: BuildSchemaOptions) {
    const metadata = TypeMetadataStorage.getObjectTypesMetadata();
    const objectTypeDefs = metadata.map((metadata) =>
      this.objectTypeDefinitionFactory.create(metadata, options),
    );
    this.typeDefinitionsStorage.addObjectTypes(objectTypeDefs);
  }

  private generateInterfaceDefs(options: BuildSchemaOptions) {
    const metadata = TypeMetadataStorage.getInterfacesMetadata();
    const interfaceDefs = metadata.map((metadata) =>
      this.interfaceDefinitionFactory.create(metadata, options),
    );
    this.typeDefinitionsStorage.addInterfaces(interfaceDefs);
  }

  private generateEnumDefs() {
    const metadata = TypeMetadataStorage.getEnumsMetadata();
    const enumDefs = metadata.map((metadata) =>
      this.enumDefinitionFactory.create(metadata),
    );
    this.typeDefinitionsStorage.addEnums(enumDefs);
  }

  private generateUnionDefs() {
    const metadata = TypeMetadataStorage.getUnionsMetadata();
    const unionDefs = metadata.map((metadata) =>
      this.unionDefinitionFactory.create(metadata),
    );
    this.typeDefinitionsStorage.addUnions(unionDefs);
  }
}
