import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RecordService} from '../../../../service/record.service';
import {CategoryService} from '../../../../service/category.service';
import {ProductService} from '../../../../service/product.service';
import {FromTypeEnum} from '../../../../common/enum/FromTypeEnum';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  @Input() recordNumber;
  @Input() fromType;

  recordEntityList = [];
  categoryId;

  constructor(private modalService: NzModalService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private recordService: RecordService, private nzMessageService: NzMessageService,
              private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.categoryId = params.categoryId;
    });
  }

  queryProductByCategoryId(categoryId: number) {
    this.categoryId = categoryId;
    let param = {
      orderBy: 'pageviews',
      sortType: 'desc',
      categoryId: categoryId,
      showAll: true
    };
    this.productService.queryProductList(param).subscribe(result => {
      this.recordEntityList = result.data.list;
      this.listOfDisplayData = this.recordEntityList;
      this.search();
    });
  }

  //今日推荐的查询
  queryProductRecommend() {
    let param = {
      orderBy: 'priority',
      sortType: 'desc',
      isNew: true,
      showAll: true
    };
    this.productService.queryProductList(param).subscribe(result => {
      this.recordEntityList = result.data.list;
      this.listOfDisplayData = this.recordEntityList;
      this.search();
    });
  }

  updateProduct(data) {
    this.router.navigate(['index/menu/operate'], {
      queryParams: {
        type: 'update',
        id: data.id,
        categoryId: data.categoryId,
        fromType: this.fromType
      }
    });
  }

  showDeleteConfirm(id): void {
    this.modalService.warning({
      nzTitle: '<p>您确定将该商品删除吗？</p>',
      nzOnOk: () => {
        this.productService.delete(id).subscribe(result => {
          if (result.status === 100) {
            if (this.fromType === FromTypeEnum.productList) {
              this.queryProductByCategoryId(this.categoryId);
            } else if (this.fromType === FromTypeEnum.recommend) {
              this.queryProductRecommend();
            }
          }
        });
      },
      nzOkText: '确定',
      nzCancelText: '取消'
    });
  }

  navDetail(data) {
    this.router.navigate(['index/menu/detail'], {
      queryParams: {
        id: data.id,
        categoryId: data.categoryId,
        fromType: this.fromType
      }
    });
  }

//过滤table
  sortName: string | null = null;
  sortValue: string | null = null;
  listOfDisplayData: any;

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    //不加就不生效，奇怪
    const data = this.recordEntityList.filter(item => true);
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.listOfDisplayData = data;
    }
  }
}
