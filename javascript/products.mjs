const client = contentful.createClient({
  space: "",
  accessToken: ""
});

export default class Products{
  async getProducts(){
    let contentful = await client.getEntries({
      content_type: "kitchenStuff"
    })
    let products = await contentful.items;
    products = await products.map(item=>{
      const {title,price} = item.fields;
      const {id} = item.sys;
      const image = item.fields.image.fields.file.url;
      return {title, price, id, image}
    })
    return products
  }
}