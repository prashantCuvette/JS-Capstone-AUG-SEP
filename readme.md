## Notes

https://docs.google.com/document/d/1OVnIB7gUXFXDCa3mhjkCQ_jD_1hkk2pEN4tpyyrVO1Q/edit?usp=sharing

### Making API Calls

```javascript
const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await res.json();
console.log(data);

// POST => we send some data to the server

const res1 = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Prashant" }),
});
const data2 = await res1.json();

const res3 = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Prashant" }),
});
const data3 = await res3.json();

const res4 = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
  method: "DELETE",
});
const data4 = await res4.json();

// MOST IMPORTANT THINGS
// 1st DB OPERAATION TAKES TIME => always use async-await
// DB OPEARTION MIGHT fail= > always use try-catch
```
