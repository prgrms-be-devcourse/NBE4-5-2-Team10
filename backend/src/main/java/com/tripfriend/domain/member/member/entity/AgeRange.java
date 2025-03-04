package com.tripfriend.domain.member.member.entity;

public enum AgeRange {

    TEENS("10대"),
    TWENTIES("20대"),
    THIRTIES("30대"),
    FORTIES_PLUS("40대 이상");

    private final String displayName;

    AgeRange(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
