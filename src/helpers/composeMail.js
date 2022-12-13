// soạn nội dung mail

function composer(user, products) {
  let html = `
<h1>Xin chào ${user.fullname}</h1>

<p style="margin-top: 24px">Phone: ${user.phoneNumber}</p>
<p style="margin-top: 16px">Address: ${user.address}</p>

<table style="margin-top: 16px; border-collapse: collapse">
  <thead>
    <tr>
      <th style="border: 0.5px solid #ccc; padding: 4px">Tên sản phẩm</th>
      <th style="border: 0.5px solid #ccc; padding: 4px">Hình ảnh</th>
      <th style="border: 0.5px solid #ccc; padding: 4px">Giá</th>
      <th style="border: 0.5px solid #ccc; padding: 4px">Số lượng</th>
      <th style="border: 0.5px solid #ccc; padding: 4px">Thành tiền</th>
    </tr>
  </thead>

  <tbody>
    ${products.map(
      (product) => `<tr>
        <td style="border: 0.5px solid #ccc; padding: 4px">${product.name}</td>
        <td style="border: 0.5px solid #ccc; padding: 4px"><img style="width: 30px" src=${
          product.image
        }></td>
        <td style="border: 0.5px solid #ccc; padding: 4px">${product.price.toLocaleString()} VND</td>
        <td style="border: 0.5px solid #ccc; padding: 4px">${
          product.quantity
        }</td>
        <td style="border: 0.5px solid #ccc; padding: 4px">${(
          product.price * product.quantity
        ).toLocaleString()} VND</td>
      </tr>`
    )}
  </tbody>
</table>

<h3 style="margin-top: 16px">Tổng thanh toán:</h3>
<h3>${products
    .reduce((p, c) => p + c.price * c.quantity, 0)
    .toLocaleString()} VND</h3>

<h3 style="margin-top: 24px">Cảm ơn bạn</h3>`;

  return html;
}

module.exports = composer;
