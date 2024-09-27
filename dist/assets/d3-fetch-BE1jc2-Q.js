function n(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(!(t.status===204||t.status===205))return t.json()}function r(t,u){return fetch(t,u).then(n)}export{r as j};
//# sourceMappingURL=d3-fetch-BE1jc2-Q.js.map
