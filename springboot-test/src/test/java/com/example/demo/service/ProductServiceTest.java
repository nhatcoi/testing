package com.example.demo.service;

import com.example.demo.dto.PricePatchRequest;
import com.example.demo.dto.ProductRequest;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Product;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductServiceTest {

    private final ProductService service = new ProductService();

    @Test
    void findAll_containsSeed() {
        List<Product> all = service.findAll();
        assertThat(all).hasSizeGreaterThanOrEqualTo(3);
    }

    @Test
    void findById_unknown_throws() {
        assertThatThrownBy(() -> service.findById(999_999L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void create_and_find() {
        ProductRequest req = new ProductRequest();
        req.setName("Test Mug");
        req.setCategory("home");
        req.setPrice(new BigDecimal("12.34"));
        req.setStock(7);

        Product created = service.create(req);
        assertThat(created.getId()).isPositive();
        assertThat(service.findById(created.getId()).getName()).isEqualTo("Test Mug");
    }

    @Test
    void searchByName_filters() {
        List<Product> r = service.searchByName("lap");
        assertThat(r).isNotEmpty();
        assertThat(r.get(0).getName().toLowerCase()).contains("lap");
    }

    @Test
    void patchPrice_updates() {
        Product first = service.findAll().get(0);
        PricePatchRequest patch = new PricePatchRequest();
        patch.setPrice(new BigDecimal("1.00"));
        Product updated = service.patchPrice(first.getId(), patch);
        assertThat(updated.getPrice()).isEqualByComparingTo("1.00");
    }

    @Test
    void adjustStock_rejectsNegativeResult() {
        Product first = service.findAll().get(0);
        assertThatThrownBy(() -> service.adjustStock(first.getId(), -(first.getStock() + 1)))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
