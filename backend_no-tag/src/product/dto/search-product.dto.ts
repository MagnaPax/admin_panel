import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchProductDto {
  @IsOptional() // null이나 undefined인 경우, 다른 유효성 검사 통과
  @IsString({ each: true }) // 각 요소에 대해 문자열 검증
  pName?: string[];

  @IsOptional()
  @IsString({ each: true })
  sex?: string[];

  // 'true' 또는 'false' 문자열인 경우에만 해당 값을 boolean으로 변환, 그 외의 경우는 변환하지 않음
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  @IsBoolean()
  kids?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true }) // 각 요소에 대해 숫자 검증
  readonly qty?: number[];
}
