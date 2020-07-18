<?php 
    use yii\helpers\Html;
    use common\models\ProductImages;
    use common\models\Company;
    use common\models\ProductComment;
    use common\models\ProductCompany;
    use common\models\Product;
    use common\helpers\Helper;  
    use common\components\Typicalproduct;

    use common\components\Post;
    use common\components\Modal;
    use common\components\Commentcomponent;
    use common\models\CommentProduct;
?>

<style type="text/css">
    .item-product .text .content img {
        max-width: 100%;
        margin: 0 auto 20px;
        max-height: 300px;
        display: block;
    }
    ._page-title a {
        color: white;
    }
    @media(max-width: 580px){
        h1._page-title a {
            color:#333;
        }
    }
</style>
<?php if(empty($empty)): ?>
<?php
    $session = Yii::$app->session;
    $username = $session->get('username');
    $nice_name = $session->get('nice_name');
    $page = Yii::$app->request->url;
    $product_id = Product::checkExistproduct($product_code);
    if(!empty($product_id)){
        $product_id = Product::checkExistproduct($product_code);
    }else{
        $product_id = ProductCompany::checkExistproduct($product_code);
    }
?>
<input type="hidden" id="pageType" value="access_base">
<input type="hidden" id="productCode" value="<?= $product_code;?>">
<div class="container">
    <div class="row">
        <div class="col-md-8 pl-0" id="mainContent">
            <?php if(!empty($product_post) && empty($has_manu)): ?>
                <?php if(!empty($product_code_parent)): ?>
                    <?php $link = Yii::$app->params['goodmax'].Helper::alias($product_post->name).'-'.$product_code_parent.'.html'; ?>
                <?php else: ?>
                    <?php $link = Yii::$app->params['goodmax'].Helper::alias($product_post->name).'-'.$product_code.'.html'; ?>
                <?php endif; ?>
            <h1 class="_page-title"><a href="<?= $link;?>" style="text-decoration: none;"><?= !empty($product_post->name)?$product_post->name:''; ?></a></h1>
            <div id="pageAction">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8">
                            <button class="button-like">
                                <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                <span class="label">Thích</span>
                            </button>
                            <button class="button-comment" data-toggle="modal" data-target="#postModal">
                                <i class="fa fa-commenting" aria-hidden="true"></i>
                                <span class="label">Đăng bài</span>
                            </button>
                            <div class="dropdown" style="display: inline-block;">
                                <button class="button-share" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                    <span class="label">Chia sẻ</span>
                                </button>
                                <div class="dropdown-menu _share_block">
                                    <a class="dropdown-item _facebook" href="#">Truy xuất</a>
                                    <a class="dropdown-item _facebook" href="#"><i class="fa fa-facebook" aria-hidden="true"></i>Facebook</a>
                                    <a class="dropdown-item _google" href="#"><i class="fa fa-google-plus" aria-hidden="true"></i>Google+</a>
                                    <a class="dropdown-item _zalo" href="#"><img src="assets/images/icon_zalo.png" alt="">Zalo</a>
                                </div>
                            </div>
                            <button class="button-follow">
                                <span class="group">
                                    <i class="fa fa-globe" aria-hidden="true"></i>
                                    <span class="value">23</span>
                                </span>
                                <span class="label">Theo dõi</span>
                            </button>
                        </div>
                        <div class="col-md-4 d-flex align-items-center justify-content-md-end">
                            <fieldset class="rating">
                                <input type="radio" id="star5" name="rating" value="5" /><label class="full" for="star5" title="Awesome - 5 stars"></label>
                                <input type="radio" id="star4half" name="rating" value="4 and a half" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
                                <input type="radio" id="star4" name="rating" value="4" /><label class="full" for="star4" title="Pretty good - 4 stars"></label>
                                <input type="radio" id="star3half" name="rating" value="3 and a half" /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
                                <input type="radio" id="star3" name="rating" value="3" /><label class="full" for="star3" title="Meh - 3 stars"></label>
                                <input type="radio" id="star2half" name="rating" value="2 and a half" /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
                                <input type="radio" id="star2" name="rating" value="2" /><label class="full" for="star2" title="Kinda bad - 2 stars"></label>
                                <input type="radio" id="star1half" name="rating" value="1 and a half" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
                                <input type="radio" id="star1" name="rating" value="1" /><label class="full" for="star1" title="Sucks big time - 1 star"></label>
                                <input type="radio" id="starhalf" name="rating" value="half" /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <?php endif; ?>
            <div class="list-product">
            <?php if(!empty($product_post) && empty($has_manu)): ?>
                <div class="item-product border">
                    <div class="dropdown post_settings">
                        <button class="btn btn-link" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#">Ghim lên đầu trang</a>
                            <a class="dropdown-item" href="#">Thay đổi ngày</a>
                            <a class="dropdown-item" href="#">Chỉnh sửa bài viết</a>
                            <a class="dropdown-item" href="#">Ẩn khỏi dòng thời gian</a>
                            <a class="dropdown-item" href="#">Xóa khỏi trang</a>
                        </div>
                    </div>
                    <div class="thumb pull-left mobile-hide">
                        <a href="#">
                            <?php if(!empty($type_img) && $type_img == 1): ?>
                                <?php 
                                    $img = Helper::getImagescompany($id);
                                    if(empty($img)){
                                        $img = '/assets/images/default.jpg';
                                    }
                                ?>
                                <?= '<img width="62px" height="63px" src="'.$img.'">';?>
                            <?php else: ?>
                                <?php 
                                    $img = Helper::getImages($id);
                                    if(empty($img)){
                                        $img = Helper::getImagescompanybyproductbaseid($id,$product_code);
                                        if(empty($img)){
                                            $img = '/assets/images/default.jpg';
                                        }
                                    }
                                ?>
                                <?= '<img width="62px" height="63px" src="'.$img.'">';?>
                            <?php endif; ?>
                            
                        </a>
                    </div>
                    <div class="text">
                        <div class="content">
                            <?php if(!empty($type_img) && $type_img == 1): ?>
                                <?php 
                                    $img = Helper::getImagescompany($id);
                                    if(empty($img)){
                                        $img = '/assets/images/default.jpg';
                                    }
                                ?>
                                <?= '<img class="thumb" src="'.$img.'">'; ?>
                            <?php else: ?>
                                <?php 
                                    $img = Helper::getImages($id);
                                    if(empty($img)){
                                        $img = Helper::getImagescompanybyproductbaseid($id,$product_code);
                                            if(empty($img)){
                                                $img = '/assets/images/default.jpg';
                                            }
                                        }
                                ?>
                                <?= '<img class="thumb" src="'.$img.'">'; ?>
                            <?php endif; ?>                            
                        </div>
                        <?php if(!empty($history)): ?>
                            <div class="history-produce panel-dropdown">
                                <h3 class="title-panel" data-toggle="collapse" href="#nksxct" aria-expanded="true" aria-controls="nksxct">
                                    <span class="pull-left ">Nhật ký sản xuất</span>
                                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                                </h3>
                                <div class="collapse show" id="nksxct">
                                    <?php if(!empty($history)) echo $history->content; ?>
                                </div>
                            </div>
                        <?php endif; ?>
                        <!--Begin product des for mobile - hien-->
                        <div class="desktop-hide mobile-show mt-4>
                            <div class="pull-right">
                                <span class="price">
                                    <?php if(!empty($product_post->unit)): ?>
                                    <?= $product_post->price.' VNĐ/'.$product_post->unit; ?>
                                    <?php else: ?>
                                    <?= $product_post->price.' VNĐ'; ?>
                                    <?php endif; ?>
                                </span>
                                <button class="add-to-cart">
                                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                                </button>
                                <button class="favorite">
                                    <i class="fa fa-heart" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="panel-dropdown product-detail" data-type="1" data-productid="668803">                           
                                <h3 class="title-panel" data-toggle="collapse" href="#product-detail" aria-expanded="false" aria-controls="product-detail">
                                    <span class="pull-left ">Thông tin sản phẩm</span>
                                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                                </h3>
                                <div class="collapse" id="product-detail">
                                    <p>
                                        <?= $product_post->description; ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!--end-->
                        <div class="product-description mobile-hide">
                            <div class="ac-product clearfix">
                                <div class="pull-left">
                                    <p>Mô tả sản phẩm</p>
                                </div>
                                
                                <div class="pull-right">
                                    <span class="price">
                                        <?php if(!empty($product_post->unit)): ?>
                                        <?= $product_post->price.' VNĐ/'.$product_post->unit; ?>
                                        <?php else: ?>
                                        <?= $product_post->price.' VNĐ'; ?>
                                        <?php endif; ?>
                                    </span>
                                    <button class="add-to-cart">
                                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                                    </button>
                                    <button class="favorite">
                                        <i class="fa fa-heart" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            <p>
                                <?= $product_post->description; ?>
                            </p>
                        </div>
                        <div class="post-action">
                            <div class="pull-left">
                                <button class="button-like liked">
                                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                    <span class="label">Thích</span>
                                </button>
                                <button class="button-comment">
                                    <i class="fa fa-commenting" aria-hidden="true"></i>
                                    <span class="label">Bình luận</span>
                                </button>
                                <button class="button-share">
                                    <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                    <span class="label">Chia sẻ</span>
                                </button>
                            </div>
                            <div class="pull-right count">
                                <span class="comment-count">2569 bình luận</span>
                                <span class="share-count">100 chia sẻ</span>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- comment -->
                        <div class="comment" data-product-id="<?= $product_id;?>">
                            <div class="header-post">
                                <div class="clearfix mb-10">
                                    <a class="pull-left " href="javascript:void(0);">Xem thêm bình luận</a>
                                    <span class="count pull-right ">123 trong số 1.000</span>
                                </div>
                            </div>
                            <div class="list-comment">
                                <!-- lay danh sach comment theo id -->
                            </div>
                            <!-- endcomment -->
                            <div class="form-comment">
                                <div class="pull-left  avatar">
                                    <a href="">
                                        <img src="<?= Yii::$app->params['frontend'];?>/images/avatar.png" alt="">
                                    </a>
                                </div>
                                <div class="comment-area">
                                    <form action="" class="comment-form comment-form-parent">
                                        <div class="input-comment" contenteditable=""></div>
                                        <div class="row action align-items-center justify-content-end">
                                            <?php if(!empty($username)): ?>
                                                <button type="button" class="btn btn-link btn-cmt-parent" style="outline:none;color: #434343;box-shadow: none;cursor: pointer;">Bình luận</button>
                                            <?php else: ?>
                                                <button type="button" class="btn btn-link" style="outline:none;color: #434343;box-shadow: none;cursor: pointer;" data-toggle="modal" data-target="#loginModal">Bình luận</button>
                                            <?php endif; ?>
                                            <button onclick="closeComment(this);" type="button" class="btn btn-link" style="outline:none;color: #434343;box-shadow: none;cursor: pointer;">Hủy</button>
                                        </div>
                                    </form>
                                </div>
                            </div>    
                        </div>
                        <div class="desktop-hide mobile-show mt-4">
                            <?php if(!empty($history)): ?>
                            <div class="history-produce panel-dropdown">
                                <h3 class="title-panel" data-toggle="collapse" href="#nksxct" aria-expanded="false" aria-controls="nksxct">
                                    <span class="pull-left ">Nhật ký sản xuất</span>
                                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                                </h3>
                                <div class="collapse" id="nksxct">
                                    <?php if(!empty($history)) echo $history->content; ?>
                                </div>
                            </div>
                            <?php endif; ?>
                            <div class="history-produce panel-dropdown info-manufacturer-mobile" data-type="<?= !empty($type_table)?$type_table:'';?>" data-productid="<?= !empty($id)?$id:'';?>">
                                
                            </div>
                   
                            <!-- cua hang dang ban san pham -->
                            <div class="store-offers shop-sell-product" data-price="<?= $product_post->price;?>" data-productcode="<?= !empty($product_code)?$product_code:'';?>" data-type="<?= !empty($type_table)?$type_table:'';?>" data-productid="<?= !empty($id)?$id:'';?>">
                                
                            </div>
                            <!-- end cua hang dang ban san pham -->
                            <div class="rating-product">
                                <h3>Đánh giá chung</h3>
                                <fieldset class="rating">
                                    <input type="radio" id="star5" name="rating" value="5"><label class="full" for="star5" title="Awesome - 5 stars"></label>
                                    <input type="radio" id="star4half" name="rating" value="4 and a half"><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
                                    <input type="radio" id="star4" name="rating" value="4"><label class="full" for="star4" title="Pretty good - 4 stars"></label>
                                    <input type="radio" id="star3half" name="rating" value="3 and a half"><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
                                    <input type="radio" id="star3" name="rating" value="3"><label class="full" for="star3" title="Meh - 3 stars"></label>
                                    <input type="radio" id="star2half" name="rating" value="2 and a half"><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
                                    <input type="radio" id="star2" name="rating" value="2"><label class="full" for="star2" title="Kinda bad - 2 stars"></label>
                                    <input type="radio" id="star1half" name="rating" value="1 and a half"><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
                                    <input type="radio" id="star1" name="rating" value="1"><label class="full" for="star1" title="Sucks big time - 1 star"></label>
                                    <input type="radio" id="starhalf" name="rating" value="half"><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            <?php elseif(!empty($product_post) && !empty($has_manu)):?>
                <div class="alert alert-info">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <strong>Sản phẩm đang được cập nhật!</strong>
                </div>
            <?php endif; ?>
            </div>
        </div>
        <aside id="sidebar" class="col-md-4 pl-0 pr-0 sidebar-left">
            <?php if(!empty($product_code)): ?>
            <div class="history-produce panel-dropdown mobile-hide">
                <h3 class="title-panel" data-toggle="collapse" href="#qrcode" aria-expanded="true" aria-controls="qrcode">
                    <span class="pull-left ">QR code</span>
                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                </h3>
                <div class="text-center" id="qrcode">
					<?php $link = 'http://truyxuat.com.vn/'.$product_code.'.html'; ?>
                    <img style="width:50%;margin: 20px auto;" src="<?php echo Helper::genQrcode($product_code);?>" alt="" > 
                   
                </div>
            </div>
            <?php endif; ?>
            <!-- thong tin nha san xuat -->
            <div class="history-produce panel-dropdown mobile-hide info-manufacturer" data-type="<?= !empty($type_table)?$type_table:'';?>" data-productid="<?= !empty($id)?$id:'';?>">
                
            </div>
            <!-- end thong tin nha san xuat -->
            <?php if(!empty($getsamemanu)): ?>
            <div class="panel-dropdown same-producer f01r">
                <h3 class="title-panel" data-toggle="collapse" href="#sidebarSameProduct" aria-expanded="false" aria-controls="sidebarSameProduct">
                    <span class="pull-left ">SẢN PHẨM CÙNG NHÀ SẢN XUẤT</span>
                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                </h3>
                <div id="sidebarSameProduct" class="collapse">
                    <div class="row list-item border">
                        <?php
                            $i=0;
                            foreach ($getsamemanu as $getsamemanu_item): 
                                if($i % 2 == 0){?>
                                    <div class="d-flex row_item">
                                        <div class="text product_item">
                                            <?php 
                                                $img = Helper::getImages($getsamemanu_item['id']);
                                                if(empty($img)){
                                                    $img = '/assets/images/default.jpg';
                                                }
                                            ?>
                                            <?php 
                                                $prd_code = $getsamemanu_item['product_code'];
                                                if($img)
                                                {
                                                    echo ' <a class="thumb" href="'.Yii::$app->params['frontend'].$prd_code.'.html">
                                                            <img src="'.$img.'"></a>';
                                                }
                                            ?>
                                            <div class="d-flex flex-column justify-content-between text">
                                                <h3 class="product_name">
                                                    <a href="<?= Yii::$app->params['frontend'] ?><?= $prd_code;?>.html"><?= $getsamemanu_item['name']; ?></a>
                                                </h3>
                                                <div class="price"><?= $getsamemanu_item['price']; ?></div>
                                            </div>
                                            <div class="social_count d-flex">
                                                <span class="col-sm-4 count-like">
                                                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                                    <span class="value">120</span>
                                                </span>
                                                <span class="col-sm-4 count-comment">
                                                    <i class="fa fa-commenting" aria-hidden="true"></i>
                                                    <span class="value">10</span>
                                                </span>
                                                <span class="col-sm-4 count-share">
                                                    <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                                    <span class="value">50</span>
                                                </span>
                                            </div>
                                        </div>
                                <?php } else {?>
                                    <div class="text product_item">
                                        <?php 
                                            $img = Helper::getImages($getsamemanu_item['id']);
                                                if(empty($img)){
                                                    $img = '/assets/images/default.jpg';
                                                }
                                            $prd_code = $getsamemanu_item['product_code'];
                                            $rt = '';
                                            if($img)
                                            {
                                                echo ' <a class="thumb" href="'.Yii::$app->params['frontend'].$prd_code.'.html">
                                                        <img src="'.$img.'"></a>';
                                            }
                                        ?>
                                        <div class="d-flex flex-column justify-content-between text">
                                            <h3 class="product_name">
                                                <a href="<?= Yii::$app->params['frontend'].$prd_code;?>.html"><?= $getsamemanu_item['name']; ?></a>
                                            </h3>
                                            <div class="price"><?= $getsamemanu_item['price']; ?></div>
                                        </div>
                                        <div class="social_count d-flex">
                                            <span class="col-sm-4 count-like">
                                                <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                                <span class="value">120</span>
                                            </span>
                                            <span class="col-sm-4 count-comment">
                                                <i class="fa fa-commenting" aria-hidden="true"></i>
                                                <span class="value">10</span>
                                            </span>
                                            <span class="col-sm-4 count-share">
                                                <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                                <span class="value">50</span>
                                            </span>
                                        </div>
                                    </div>
                                    </div>
                                <?php }
                                $i++;
                            endforeach; 
                        ?>
                    </div>
                </div>
            </div>
            <?php endif; ?>
            <?php if(!empty($category)): ?>
            <div class="panel-dropdown related-producer f01r">
                <h3 class="title-panel" data-toggle="collapse" href="#sidebarRelatedProduct" aria-expanded="false" aria-controls="sidebarRelatedProduct">
                    <span class="pull-left ">SẢN PHẨM CÙNG LOẠI</span>
                    <i class="fa fa-chevron-right pull-right " aria-hidden="true"></i>
                </h3>
                <div id="sidebarRelatedProduct" class="collapse">
                    <div class="row list-item border">                  
                        <?php 
                            $i=0;
                            foreach ($category as $category_item):
                                if($i % 2 == 0){?>
                                    <div class="d-flex row_item">
                                        <div class="text product_item">
                                            <?php 
                                                if($type_table == 1){
                                                    $img = Helper::getImages($category_item['id']);
                                                    
                                                }elseif($type_table == 2 || $type_table == 3){
                                                    $img = Helper::getImagescompany($category_item['id']);
                                                }
                                                    if(empty($img)){
                                                        $img = '/assets/images/default.jpg';
                                                    }
                                                if($img)
                                                {
                                                    echo ' <a class="thumb" href="'.Yii::$app->params['frontend'].$category_item['product_code'].'.html">
                                                            <img src="'.$img.'"></a>';
                                                }
                                            ?>
                                            <div class="d-flex flex-column justify-content-between text">
                                                <h3 class="product_name">
                                                    <a href="<?= Yii::$app->params['frontend'].$category_item['product_code'].'.html'?>"><?= $category_item['name']; ?></a>
                                                </h3>
                                                <div class="price"><?= $category_item['price']; ?></div>
                                            </div>
                                            <div class="social_count d-flex">
                                                <span class="col-sm-4 count-like">
                                                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                                    <span class="value">120</span>
                                                </span>
                                                <span class="col-sm-4 count-comment">
                                                    <i class="fa fa-commenting" aria-hidden="true"></i>
                                                    <span class="value">10</span>
                                                </span>
                                                <span class="col-sm-4 count-share">
                                                    <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                                    <span class="value">50</span>
                                                </span>
                                            </div>
                                        </div>
                                <?php } else {?>
                                    <div class="text product_item">
                                        <?php 
                                                if($type_table == 1){
                                                    $img = Helper::getImages($category_item['id']);
                                                    
                                                }elseif($type_table == 2 || $type_table == 3){
                                                    $img = Helper::getImagescompany($category_item['id']);
                                                }
                                                if(empty($img)){
                                                    $img = '/assets/images/default.jpg';
                                                }
                                            if($img)
                                            {
                                                echo ' <a class="thumb" href="'.Yii::$app->params['frontend'].$category_item['product_code'].'.html">
                                                        <img src="'.$img.'"></a>';
                                            }
                                        ?>
                                        <div class="d-flex flex-column justify-content-between text">
                                            <h3 class="product_name">
                                                <a href="<?= Yii::$app->params['frontend'].$category_item['product_code'].'.html'?>"><?= $category_item['name']; ?></a>
                                            </h3>
                                            <div class="price"><?= $category_item['price']; ?></div>
                                        </div>
                                        <div class="social_count d-flex">
                                            <span class="col-sm-4 count-like">
                                                <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                                <span class="value">120</span>
                                            </span>
                                            <span class="col-sm-4 count-comment">
                                                <i class="fa fa-commenting" aria-hidden="true"></i>
                                                <span class="value">10</span>
                                            </span>
                                            <span class="col-sm-4 count-share">
                                                <i class="fa fa-share-square-o" aria-hidden="true"></i>
                                                <span class="value">50</span>
                                            </span>
                                        </div>
                                    </div>
                                    </div>
                                <?php }
                                $i++;
                            endforeach; 
                        ?>
                    </div>
                </div>
            </div>
            <?php endif; ?>
            <!-- san pham lien quan -->
            <div class="related-product panel-dropdown related-producer f01r" data-name="<?= $product_name?$product_name:'';?>">
                
            </div>
            <!-- cua hang dang ban san pham -->
            <div class="store-offers mobile-hide shop-sell-product" data-price="<?= $product_post->price;?>" data-productcode="<?= !empty($product_code)?$product_code:'';?>" data-type="<?= !empty($type_table)?$type_table:'';?>" data-productid="<?= !empty($id)?$id:'';?>">
                
            </div>
            <!-- end cua hang dang ban san pham -->
        </aside>
    </div>
</div>
<div id="postModal" class="modal fade modal-custom" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="" id="postArticle">
                <div class="modal-body">
                    <div class="neo-tabs">
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="active">
                                <a href="javascript:void(0)" data-tab="article" role="neo-tab">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                    <span>Viết bài</span>
                                </a>
                            </li>
                            <li class="">
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#createAlbum">
                                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                                    <span>Album ảnh</span>
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active" data-id="article">
                                <div class="form-post">
                                    <div class="pull-left avatar">
                                        <a href="">
                                            <img src="<?= Yii::$app->params['frontend'];?>/images/avatar.png" alt="">
                                        </a>
                                    </div>
                                    <div class="post-area">
                                        <form action="" class="comment-form">
                                            <div class="input-comment" contenteditable=""></div>
                                            <textarea name="" id="" cols="30" rows="10" style="display: none;"></textarea>
                                        </form>
                                    </div>
                                </div>
                                <div class="form-img">
                                    <div class="d-flex flex-wrap list_img">
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a1.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a3.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a2.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a1.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a3.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a2.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <a href="">
                                                <div class="thumb">
                                                    <img src="images/a1.jpg" alt="">
                                                </div>
                                            </a>
                                            <div class="overlay">
                                                <div class="wrap">
                                                    <button class="btn remove-img" type="button">
                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                    <button class="btn tags-img" type="button">
                                                        <i class="fa fa-tags"></i>
                                                    </button>
                                                    <button class="btn edit-img" type="button">
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-3 p-1 item">
                                            <button class="input_upload" type="button">
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                                <input class="input_upload_img" type="file" name="myImage" accept="image/x-png,image/gif,image/jpeg" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="post-action">
                                    <div class="flex">
                                        <button class="btn link item col-5" type="button">
                                            <i class="fa fa-picture-o" aria-hidden="true" style="color:#89be4a;"></i>
                                            <span>Ảnh</span>
                                        </button>
                                        <button class="btn link item col-5" type="button">
                                            <i class="fa fa-tags" aria-hidden="true" style="color:#8fc2d7;"></i>
                                            <span>Gắn thẻ bạn bè</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" data-id="gallery">
                                <div class="form-post">
                                    <div class="pull-left avatar">
                                        <a href="">
                                            <img src="<?= Yii::$app->params['frontend'];?>/images/avatar.png" alt="">
                                        </a>
                                    </div>
                                    <div class="post-area">
                                        <form action="" class="comment-form">
                                            <div class="input-comment" contenteditable=""></div>
                                            <textarea name="" id="" cols="30" rows="10" style="display: none;"></textarea>
                                        </form>
                                    </div>
                                </div>
                                <div class="form-img">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <div class="pull-left">
                        <span class="dropdown composerAudienceWrapper">
                            <button class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-globe" aria-hidden="true"></i>
                                <span>Mọi người</span>
                                <span class="caret"></span>
                            </button>
                            <div class="dropdown-menu">
                                <em>Ai sẽ nhìn thấy nội dung này?</em>
                                <ul>
                                    <li>
                                        <a class="selected" href="#">
                                            <i class="fa fa-globe" aria-hidden="true"></i>
                                            <div class="tx">
                                                <span>Mọi người</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-users" aria-hidden="true"></i>
                                            <div class="tx">
                                                <span>Bạn bè</span>
                                                <em>Bạn bè của bạn</em>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-user-times" aria-hidden="true"></i>
                                            <div class="tx">
                                                <span>Bạn bè ngoại trừ...</span>
                                                <em>Bạn bè; ngoại trừ: Duyệt OCCHO</em>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-user-secret" aria-hidden="true"></i>
                                            <div class="tx">
                                                <span>Bạn bè cụ thể</span>
                                                <em>Chỉ hiển thị với một số bạn bè</em>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i class="fa fa-lock" aria-hidden="true"></i>
                                            <div class="tx">
                                                <span>Chỉ mình tôi</span>
                                                <em>Chỉ hiển thị mình tôi</em>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </span>
                        <span class="dropdown createAlbum">
                            <button class="btn btn-primary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span>+ Album</span>
                                <span class="caret"></span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dLabel">
                                <h3>Album</h3>
                                <div class="list-item">
                                    <div class="item">
                                        <button class="" type="button">
                                            <i class="fa fa-plus" aria-hidden="true"></i>
                                            <span>Tạo Album</span>
                                            <input class="input_upload_img" type="file" name="myImage" accept="image/x-png,image/gif,image/jpeg" />
                                        </button>
                                    </div>
                                    <div class="item">
                                        <a href="">
                                            <div class="thumb">
                                                <img src="images/a1.jpg" alt="">
                                            </div>
                                            <h3 class="title">
                                                <i class="fa fa-globe" aria-hidden="true"></i>
                                                <span>Tết của Héo</span>
                                            </h3>
                                            <em>1 bài viết</em>
                                        </a>
                                    </div>
                                    <div class="item">
                                        <a href="">
                                            <div class="thumb">
                                                <img src="images/a3.jpg" alt="">
                                            </div>
                                            <h3 class="title">
                                                <i class="fa fa-globe" aria-hidden="true"></i>
                                                <span>Tóc mới</span>
                                            </h3>
                                            <em>1 bài viết</em>
                                        </a>
                                    </div>
                                    <div class="item">
                                        <a href="">
                                            <div class="thumb">
                                                <img src="images/a2.jpg" alt="">
                                            </div>
                                            <h3 class="title">
                                                <i class="fa fa-lock" aria-hidden="true"></i>
                                                <span>Mộc Châu</span>
                                            </h3>
                                            <em>4 bài viết</em>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <div class="pull-right">
                        <button class="btn btn-primary" type="button">Đăng</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- end modal post -->
<div id="createAlbum" class="modal fade modal-custom" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content d-flex w-100 p-0">
            <form action="" id="album" class="d-flex w-100 p-0">
                <div class="modal-header">
                    <h3>Tạo album</h3>
                </div>
                <div class="modal-body">
                    <div class="row main-body h-100">
                        <div class="sidebar col-md-3">
                            <div class="form-group">
                                <input type="text" placeholder="Tên album" class="w-100 font-weight-bold border-bottom-0">
                                <input type="text" placeholder="Mô tả" class="w-100">
                            </div>
                            <div class="form-group">
                                <input type="text" class="w-100" placeholder="Vị trí">
                            </div>
                            <h6 class="font-weight-bold" style="font-size: 14px;">Được gắn thẻ trong album này</h6>
                            <p>Nhấp vào bất cứ đâu trên ảnh của bạn để gắn thẻ bạn bè</p>
                            <h6 class="font-weight-bold" style="font-size: 14px;">Cho phép bạn bè thêm ảnh</h6>
                            <div class="form-group">
                                <label for="add_fr_00">
                                    <input type="checkbox" id="add_fr_00">
                                    <span>Thêm người đóng góp</span>
                                </label>
                                <input type="text" placeholder="Nhập tên bạn bè" class="w-100 mb-2">
                                <span>Thêm bạn bè làm người đóng góp và họ có thể thêm ảnh của chính họ, bài viết văn bản, v.v.</span>
                            </div>
                            <h6 class="font-weight-bold" style="font-size: 14px;">Tùy chọn khác</h6>
                            <div class="form-group">
                                <label for="qua_img">
                                    <input type="checkbox" id="qua_img">
                                    <span>Chất lượng cao</span>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-9 list_image_upload">
                            <div class="row">
                                <div class="col-md-4 item_image border">
                                    <div class="wrap-thumb d-flex justify-content-center">
                                        <img src="assets/images/k.jpg" alt="">
                                        <div class="btn-group">
                                            <button type="button" class="btn_settings dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i data-toggle="tooltip" data-placement="top" title="Cài đặt" class="fa fa-cog" aria-hidden="true"></i>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="javascript:void(0)" data-toggle="popover" data-popover-content="div[data-location]" data-trigger="click" data-placement="bottom">Chỉnh sửa vị trí</a>
                                                <a class="dropdown-item" href="#">Thay đổi ngày</a>
                                                <a class="dropdown-item" href="#">Đặt làm ảnh bìa album</a>
                                            </div>
                                            <div data-location class="hidden-lg-down">
                                                <input type="text">
                                            </div>
                                        </div>
                                        <button class="btn_remove" data-toggle="tooltip" data-placement="bottom" title="Xóa ảnh">
                                            <i class="fa fa-times" aria-hidden="true"></i>
                                        </button>
                                        <button class="btn_rotate_img" data-toggle="tooltip" data-placement="bottom" title="Xoay ảnh">
                                            <i class="fa fa-refresh" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                    <div class="text">
                                        <div class="image_description" contenteditable="true" placeholder="Nói gì đó về ảnh này..."></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <span class="dropdown composerAudienceWrapper">
                        <button class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-globe" aria-hidden="true"></i>
                            <span>Mọi người</span>
                            <span class="caret"></span>
                        </button>
                        <div class="dropdown-menu">
                            <em>Ai sẽ nhìn thấy nội dung này?</em>
                            <ul>
                                <li>
                                    <a class="selected" href="#">
                                        <i class="fa fa-globe" aria-hidden="true"></i>
                                        <div class="tx">
                                            <span>Mọi người</span>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i class="fa fa-users" aria-hidden="true"></i>
                                        <div class="tx">
                                            <span>Bạn bè</span>
                                            <em>Bạn bè của bạn</em>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i class="fa fa-user-times" aria-hidden="true"></i>
                                        <div class="tx">
                                            <span>Bạn bè ngoại trừ...</span>
                                            <em>Bạn bè; ngoại trừ: Duyệt OCCHO</em>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i class="fa fa-user-secret" aria-hidden="true"></i>
                                        <div class="tx">
                                            <span>Bạn bè cụ thể</span>
                                            <em>Chỉ hiển thị với một số bạn bè</em>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i class="fa fa-lock" aria-hidden="true"></i>
                                        <div class="tx">
                                            <span>Chỉ mình tôi</span>
                                            <em>Chỉ hiển thị mình tôi</em>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </span>
                    <button class="btn btn-primary" type="button">Đăng</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php else: ?>
    <!-- <style type="text/css">
        .f01r .list-item .product_item {
            flex: 0 0 33.33333%;
            max-width: 33.33333%;
        }
    </style> -->
    <?= Typicalproduct::widget(); ?>
<?php endif; ?>