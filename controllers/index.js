function getProduct() {
  var promise = axios({
    url: "http://svcy.myclass.vn/api/Product/GetAll", //Đường dẫn backend cung cấp
    method: "GET", //method backend cung cấp
  });
  //Xử lý thành công
  promise.then(function (result) {
    console.log("hihi ", result.data);
    //Sau khi lấy dữ liệu từ backend về dùng dữ liệu đó tạo ra tr trên table
    renderProduct(result.data);
  });
  //Xử lý thất bại
  promise.catch(function (err) {});
}

//Gọi hàm lấy dữ liệu từ server khi trang web vừa load xong
window.onload = function () {
  document.querySelector("#Update").disabled = true;

  getProduct();
};
document.querySelector("#Create").onclick = function () {
  //   var pd = {};
  var pd = new Product();
  //Lấy thông tin người dùng từ giao diện nhập liệu
  pd.id = document.querySelector("#id").value;
  pd.img = document.querySelector("#image").value;
  pd.name = document.querySelector("#name").value;
  pd.price = document.querySelector("#price").value;
  pd.description = document.querySelector("#priceDescription").value;
  pd.type = document.querySelector("#ProductType").value;
  console.log("mang them", pd);
  //Gọi api đưa dữ liệu về backend
  var promise = axios({
    url: "http://svcy.myclass.vn/api/Product/CreateProduct",
    method: "POST",
    data: pd, //Dữ liệu gửi đi
  });

  promise.then(function (result) {
    //Gọi lại api lấy danh sách sinh viên sau khi thêm thành công
    getProduct();
    console.log(result.data.content);
    if (result.data.content === "id product already exists !") {
      alert("Trùng ID sản phẩm");
    } else {
      document.getElementById("myForm").reset();
    }
  });

  promise.catch(function (error) {
    console.log(error);
  });
};
function deleteProduct(idProduct) {
  if (confirm("Bấm vào nút OK để xóa sản phẩm") == true) {
    var promise = axios({
      url: "http://svcy.myclass.vn/api/Product/DeleteProduct/" + idProduct,
      method: "DELETE",
    });
    console.log("id product", idProduct);
    //Thành công
    promise.then(function (result) {
      console.log(result.data);
      //Gọi api lấy danh sách sinh viên sau khi xoá thành công => render lại table
      getProduct();
    });
    //Thất bại
    promise.catch(function (err) {});
  } else {
  }
}

function editProduct(idProduct) {
  document.querySelector("#Create").disabled = true;
  document.querySelector("#Update").disabled = false;

  var promise = axios({
    url: "http://svcy.myclass.vn/api/Product/GetById/" + idProduct,
    method: "GET",
  });
  //Thành công
  promise.then(function (result) {
    var pd = result.data;
    console.log("pd.img", pd);
    //Đem sinh viên load lên các thẻ

    document.querySelector("#id").value = pd.id;
    document.querySelector("#id").disabled = true;

    document.querySelector("#image").value = pd.img;

    document.querySelector("#name").value = pd.name;
    document.querySelector("#price").value = pd.price;
    document.querySelector("#priceDescription").value = pd.description;
    document.querySelector("#ProductType").value = pd.type;
  });
  //Thất bại
  promise.catch(function (error) {
    console.log(error);
  });
}

//-------------------------------- PUT: Cập nhật dữ liệu -----------------------------------------

document.querySelector("#Update").onclick = function () {
  var pdUpdate = new Product();
  pdUpdate.id = document.querySelector("#id").value;
  pdUpdate.img = document.querySelector("#image").value;
  pdUpdate.name = document.querySelector("#name").value;
  pdUpdate.price = document.querySelector("#price").value;
  pdUpdate.description = document.querySelector("#priceDescription").value;
  pdUpdate.type = document.querySelector("#ProductType").value;
  console.log("pdUpdate.id", pdUpdate.img);
  //Call api
  var promise = axios({
    url: "http://svcy.myclass.vn/api/Product/UpdateProduct/" + pdUpdate.id,
    method: "PUT",
    data: pdUpdate,
  });
  console.log("pdUpdate", pdUpdate);

  promise.then(function (result) {
    //Thành công
    console.log(result.data);

    getProduct(); //Load lại table
    if (result.data.content === "The product has been successfully updated !") {
      document.getElementById("myForm").reset();
      document.querySelector("#id").disabled = false;
      document.querySelector("#Update").disabled = true;
      document.querySelector("#Create").disabled = false;
    } else {
    }
  });

  promise.catch(function (err) {
    console.log(err);
  });
};
document.querySelector("#Search1").onclick = function () {
  var getValuneSearch = document.querySelector("#SearchInput1").value;
  console.log("getValuneSearch", getValuneSearch);
  searchProduct(getValuneSearch);
};
function searchProduct(nameProduct) {
  var promise = axios({
    url: "http://svcy.myclass.vn/api/Product/SearchByName?name=" + nameProduct,
    method: "GET",
  });
  console.log("name product", nameProduct);
  console.log("name product", typeof nameProduct);

  //Thành công
  promise.then(function (result) {
    console.log("nasearchme product", result.data);

    //Gọi api lấy danh sách sinh viên sau khi xoá thành công => render lại table
    // getProduct();
    renderProduct(result.data);
  });
  //Thất bại
  promise.catch(function (err) {
    alert("Không tìm thấy");
  });
}
function renderProduct(arrProduct) {
  //param : input :arrSinhVien
  var imge = "";
  var html = ""; //output: string html
  for (var i = 0; i < arrProduct.length; i++) {
    var pd = arrProduct[i]; //Mỗi lần duyệt lấy ra 1 object sinhVien từ mảng {maSinhVien:'1',tenSinhVien:'...',...}
    // imge.push(pd.img);
    imge = pd.img;
    html += `
            <tr>
                <td>${pd.id}</td>
      

                <td><img style="height:50px; width:50px" class="" src="${imge}" alt="Image"></td>

                
               

       
              
               
                <td>${pd.name}</td>
                <td>${pd.price}</td>
                <td>${pd.description}</td>
                <td>${pd.type}</td>

                <td>
                    
                    <button class="btn btn-danger border-0" onclick="deleteProduct('${pd.id}')"><i class="fa-regular fa-trash-can"></i></button>
                    <button class="btn btn-primary mr-2 border-0" onclick="editProduct('${pd.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
        `;
  }

  document.querySelector("#productTable").innerHTML = html;
}
