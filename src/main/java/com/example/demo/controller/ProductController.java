package com.example.demo.controller;

import com.example.demo.dto.PricePatchRequest;
import com.example.demo.dto.ProductRequest;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> list() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable long id) {
        return productService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest body) {
        return productService.create(body);
    }

    @PutMapping("/{id}")
    public Product replace(@PathVariable long id, @Valid @RequestBody ProductRequest body) {
        return productService.update(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable long id) {
        productService.delete(id);
    }

    @GetMapping("/category/{category}")
    public List<Product> byCategory(@PathVariable String category) {
        return productService.findByCategory(category);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam(required = false) String q) {
        return productService.searchByName(q);
    }

    @GetMapping("/count")
    public Map<String, Long> count() {
        return Map.of("count", productService.count());
    }

    @PatchMapping("/{id}/price")
    public Product patchPrice(@PathVariable long id, @Valid @RequestBody PricePatchRequest body) {
        return productService.patchPrice(id, body);
    }

    @GetMapping("/{id}/exists")
    public Map<String, Boolean> exists(@PathVariable long id) {
        return Map.of("exists", productService.exists(id));
    }

    @PatchMapping("/{id}/stock")
    public Product adjustStock(@PathVariable long id, @RequestParam int delta) {
        return productService.adjustStock(id, delta);
    }
}
