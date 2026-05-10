package com.example.demo.service;

import com.example.demo.dto.PricePatchRequest;
import com.example.demo.dto.ProductRequest;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final Map<Long, Product> store = new ConcurrentHashMap<>();
    private final AtomicLong idSeq = new AtomicLong(1);

    public ProductService() {
        seed();
    }

    private void seed() {
        createInternal("Laptop", "electronics", new BigDecimal("1299.99"), 5);
        createInternal("Desk Chair", "furniture", new BigDecimal("199.00"), 12);
        createInternal("Notebook", "stationery", new BigDecimal("4.50"), 100);
    }

    private Product createInternal(String name, String category, BigDecimal price, int stock) {
        long id = idSeq.getAndIncrement();
        Product p = new Product(id, name, category, price, stock);
        store.put(id, p);
        return p;
    }

    public List<Product> findAll() {
        return store.values().stream()
                .sorted(Comparator.comparing(Product::getId))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public Product findById(long id) {
        Product p = store.get(id);
        if (p == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        return p;
    }

    public Product create(ProductRequest req) {
        return createInternal(req.getName(), req.getCategory(), req.getPrice(), req.getStock());
    }

    public Product update(long id, ProductRequest req) {
        Product existing = findById(id);
        existing.setName(req.getName());
        existing.setCategory(req.getCategory());
        existing.setPrice(req.getPrice());
        existing.setStock(req.getStock());
        return existing;
    }

    public void delete(long id) {
        if (store.remove(id) == null) {
            throw new NotFoundException("Product not found: " + id);
        }
    }

    public List<Product> findByCategory(String category) {
        String c = category.toLowerCase(Locale.ROOT);
        return store.values().stream()
                .filter(p -> p.getCategory().toLowerCase(Locale.ROOT).equals(c))
                .sorted(Comparator.comparing(Product::getId))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Product> searchByName(String q) {
        if (q == null || q.isBlank()) {
            return findAll();
        }
        String needle = q.toLowerCase(Locale.ROOT);
        return store.values().stream()
                .filter(p -> p.getName().toLowerCase(Locale.ROOT).contains(needle))
                .sorted(Comparator.comparing(Product::getId))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public long count() {
        return store.size();
    }

    public Product patchPrice(long id, PricePatchRequest req) {
        Product p = findById(id);
        p.setPrice(req.getPrice());
        return p;
    }

    public boolean exists(long id) {
        return store.containsKey(id);
    }

    public Product adjustStock(long id, int delta) {
        Product p = findById(id);
        int next = p.getStock() + delta;
        if (next < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        p.setStock(next);
        return p;
    }
}
