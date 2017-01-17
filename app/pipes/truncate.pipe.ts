import {Pipe, PipeTransform} from "@angular/core";
/**
 * Created by stas on 13.01.17.
 */
// truncate.ts

/**
 * Usage:
 * <pre>
 * <p>{{ 'this is a not so long string' | truncate }}</p>
 * <p>{{ 'this is a not so long string' | truncate : 20 }}</p>
 * <p>{{ 'this is a not so long string' | truncate : 20 : '.' }}</p>
 * </pre>
 */
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform{
  transform(value: string, args: number) : string {
    let limit = args;
    if(value)
      return value.length > limit ? value.substring(0, limit) + "...": value;
    return "";
  }
}
