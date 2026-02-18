package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contractors")
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private String companyType;

    private Integer yearsInBusiness;

    private String licenseNumber;

    private String insuranceProvider;

    private String website;

    // 🔹 One-to-One relationship with User
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // ✅ Default Constructor
    public Contractor() {
    }

    // ✅ Parameterized Constructor
    public Contractor(String companyName, String companyType,
        Integer yearsInBusiness, String licenseNumber,
        String insuranceProvider, String website, User user) {
        this.companyName = companyName;
        this.companyType = companyType;
        this.yearsInBusiness = yearsInBusiness;
        this.licenseNumber = licenseNumber;
        this.insuranceProvider = insuranceProvider;
        this.website = website;
        this.user = user;
    }

    // ========================
    // GETTERS & SETTERS
    // ========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }

    public Integer getYearsInBusiness() {
        return yearsInBusiness;
    }

    public void setYearsInBusiness(Integer yearsInBusiness) {
        this.yearsInBusiness = yearsInBusiness;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}