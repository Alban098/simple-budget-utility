/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.EnumMap;
import java.util.Map;
import org.alban098.sbu.dto.AmountDto;
import org.alban098.sbu.entity.Amount;
import org.alban098.sbu.utils.Currency;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CurrencyService {

  private final Map<Currency, Map<Currency, Double>> exchangeRates = new EnumMap<>(Currency.class);
  private static final String EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/%s";

  public CurrencyService() {
    refreshExchangeRate();
  }

  public double convert(AmountDto amount, Currency currency) {
    double exchangeRate = exchangeRates.get(amount.getCurrency()).get(currency);
    return amount.getValue() * exchangeRate;
  }

  public double convert(Amount amount, Currency currency) {
    double exchangeRate = exchangeRates.get(amount.getCurrency()).get(currency);
    return amount.getValue() * exchangeRate;
  }

  public void refreshExchangeRate() {
    for (Currency from : Currency.values()) {
      RestClient apiClient = RestClient.create();
      String apiResponse =
          apiClient
              .get()
              .uri(String.format(EXCHANGE_RATE_API, from.name()))
              .retrieve()
              .body(String.class);
      JsonObject jsonObject = new Gson().fromJson(apiResponse, JsonObject.class);
      JsonObject rates = jsonObject.getAsJsonObject("rates");

      for (Currency to : Currency.values()) {
        double exchangeRate = rates.get(to.name()).getAsDouble();
        exchangeRates
            .computeIfAbsent(from, c -> new EnumMap<>(Currency.class))
            .put(to, exchangeRate);
      }
    }
  }
}
