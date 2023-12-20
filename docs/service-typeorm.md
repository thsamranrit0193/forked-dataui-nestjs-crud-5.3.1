---
layout: page
title: ServicesTypeorm
permalink: /service-typeorm/
nav_order: 16
---

This package provides a CRUD service for relational databases build with TypeORM

## Install

```shell
npm i @dataui/crud-typeorm @nestjs/typeorm typeorm
```

## Usage

Assume you have some TypeORM **enitity**:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}
```

Then you need to create a **service**:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Company } from './company.entity';

@Injectable()
export class CompaniesService extends TypeOrmCrudService<Company> {
  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}
```

After that you need to provide your service in a **controller**:

```typescript
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

@Crud({
  model: {
    type: Company,
  },
})
@Controller('companies')
export class CompaniesController implements CrudController<Company> {
  constructor(public service: CompaniesService) {}
}
```
