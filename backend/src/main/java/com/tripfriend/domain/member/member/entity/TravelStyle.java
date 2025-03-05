package com.tripfriend.domain.member.member.entity;

public enum TravelStyle {

    TOURISM("관광"),
    RELAXATION("휴양"),
    SHOPPING("쇼핑");

    private final String travelStyle;

    TravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
    }

    public String getTravelStyle() {
        return travelStyle;
    }
}
