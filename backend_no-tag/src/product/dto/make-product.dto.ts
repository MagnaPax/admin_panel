import { CreateProductDto } from './create-product.dto';
import { ValidateNested, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class MakeProductDto {
  // 쿼리스트링을 객체로 변환
  @Transform((params: TransformFnParams) => {
    const productDto = JSON.parse(params.value);
    return Object.assign(new CreateProductDto(), productDto);
  })
  // 유효성 검사
  @ValidateNested({ each: true })
  @Validate(CreateProductDto)
  data: CreateProductDto;
}
