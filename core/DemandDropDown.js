import React, { useEffect, useState } from "react";
import { httpPostRequest } from '../helper/JsHelper';
import { getCountry, currencyGet, countryGetByKey, getCityByCountryKey, cityGetByKey, provinceGetByCountryKey, provinceGetByKey } from '../helper/RequestPayLoad';
import SingelSelectOnDemand from "./SingelSelectOnDemand";
import { newConstants } from "../helper/constants";
import PhoneInput from 'react-phone-input-2'
import { useStore } from '../helper/Store';
import LanguageConfig from "../helper/LanguageConfig";

const Country = ({ error, name, value: country_key, helperText, onChange }) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([])
  const getCountryByKey = async () => {
    if (country_key) {
      let res = await httpPostRequest(countryGetByKey(country_key))
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setValue({ value: country_key, label: res.data[newConstants.COUNTRY_NAME] })
      }
    }
  }
  useEffect(() => {
    getCountryByKey()
  }, [country_key]);

  useEffect(() => {
    loadCountry()
  }, []);

  const loadCountry = async (inputValue = "", callback = null) => {
    let res = await httpPostRequest(getCountry(inputValue))
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(res.data.countries.map((v) => ({ value: v[newConstants.COUNTRY_KEY], label: v[newConstants.COUNTRY_NAME] })))
      }
      else {
        setDefaultValue(res.data.countries.map((v) => ({ value: v[newConstants.COUNTRY_KEY], label: v[newConstants.COUNTRY_NAME] })))
      }
    }
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={value ? [value].concat(defaultValue.filter(f => f.value != value.value)) : defaultValue}
      value={value}
      loadOptions={loadCountry}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="ticketsupplier.country" />}
      helperText={helperText}
      error={error}
    />)
}

const City = ({ name, country_key, value: city_key, helperText, error, onChange }) => {
  const [value, setValue] = useState(null)
  const [cities, setCities] = useState([]);

  const getCityByKey = async () => {
    if (city_key) {
      let res = await httpPostRequest(cityGetByKey(city_key))
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setValue({ value: city_key, label: res.data[newConstants.CITY_NAME] })
      }
    }
  }

  useEffect(() => {
    getCityByKey()
  }, [city_key]);

  const loadCity = async () => {
    let res = await httpPostRequest(getCityByCountryKey(country_key))
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setCities(res[newConstants.DATA]);
    }
  }

  useEffect(() => { loadCity() }, [country_key])

  const loadOptions = async (inputValue, callback) => {
    let filter_data = cities.map((v) => v[newConstants.CITY_NAME].toLowerCase().includes(inputValue.toLowerCase()) ? ({ value: v[newConstants.CITY_KEY], label: v[newConstants.CITY_NAME] }) : null).filter(f => f)
    callback(filter_data)
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={cities.map((v) => ({ value: v[newConstants.CITY_KEY], label: v[newConstants.CITY_NAME] }))}
      value={value}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="ticketsupplier.city" />}
      name={name}
      helperText={helperText}
      error={error}
    />)
}


const Province = ({ name, country_key, value: province_key, helperText, error, onChange }) => {
  const [value, setValue] = useState(null)
  const [provinces, setProvinces] = useState([]);

  const getProvincesByKey = async () => {
    if (province_key) {
      let res = await httpPostRequest(provinceGetByKey(province_key))
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setValue({ value: province_key, label: res.data[newConstants.PROVINCE_NAME] })
      }
    }
  }

  useEffect(() => {
    getProvincesByKey()
  }, [province_key]);

  const loadProvinces = async () => {
    let res = await httpPostRequest(provinceGetByCountryKey(country_key))
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setProvinces(res[newConstants.DATA]);
    }
  }

  useEffect(() => { loadProvinces() }, [country_key])

  const loadOptions = async (inputValue, callback) => {
    let filter_data = provinces.map((v) => v[newConstants.PROVINCE_NAME].toLowerCase().includes(inputValue.toLowerCase()) ? ({ value: v[newConstants.PROVINCE_KEY], label: v[newConstants.PROVINCE_NAME] }) : null).filter(f => f)
    callback(filter_data)
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={provinces.map((v) => ({ value: v[newConstants.PROVINCE_KEY], label: v[newConstants.PROVINCE_NAME] }))}
      value={value}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.procinces" />}
      name={name}
      helperText={helperText}
      error={error}
    />)
}

const Currency = ({ name, currency, onChange, error, helperText }) => {
  const [value, setValue] = useState(null)
  const [currencies, setCurrencies] = useState([]);

  const loadCurrency = async () => {
    let res = await httpPostRequest(currencyGet(""))
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setCurrencies(res.data.cities.map(v => ({ value: v["currency-code"], label: v["currency-name"] })))
    }
  }

  useEffect(() => {
    loadCurrency()
  }, []);
  useEffect(() => {
    let value_ = currencies.filter(f => f.value == currency);
    setValue(value_.length ? value_[0] : null)
  }, [currency, currencies]);

  const loadOptions = async (inputValue, callback) => {
    callback(currencies.map((v) => v[newConstants.LABEL].toLowerCase().includes(inputValue.toLowerCase()) ? ({ value: v[newConstants.VALUE], label: v[newConstants.LABEL] }) : null).filter(f => f))
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={currencies}
      value={value}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="ledgers.currency" />}
      name={name}
      error={error}
      helperText={helperText}
    />)
}

const ContactNum = ({ label, onChange, name, value, error, helperText, ...props }) => {
  return (
    <div>
      <PhoneInput
        country={'+91'}
        value={value}
        specialLabel={<p style={{ color: `${error ? 'red' : '#000'}`, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', opacity: 1, fontSize: '12px', fontFamily: 'Antic' }}>{label}</p>}
        enableSearch
        inputStyle={error ? { borderColor: 'red', borderWidth: 1, width: '100%', boxShadow: 'none' } : { width: '100%' }}
        onChange={(e) => onChange({ target: { value: e, name: name } })}
        {...props}
      />
      {error && helperText ? <span style={{ color: '#E34231', fontSize: 12, marginLeft: 15 }}>{helperText}</span> : null}
    </div>)
}

const ContactNumber = ({ label, value, setValue, ...props }) => {
  return (
    <>
      <PhoneInput
        country={value.country}
        value={value.value}
        specialLabel={<p style={{ color: `${value.isError ? 'red' : '#000'}`, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', opacity: 1, fontSize: '12px', fontFamily: 'Antic' }}>{label}</p>}
        enableSearch
        inputStyle={value.isError ? { borderColor: 'red', borderWidth: 1, width: '100%', boxShadow: 'none' } : { width: '100%' }}
        onChange={(phone, country) => setValue({ isError: phone === "", msg: phone === "" ? "This is required field!" : "", value: phone, country: country.countryCode, code: country.dialCode })}
        disableSearchIcon
        searchStyle={{ width: '93%' }}
        {...props}
      />
      {value.isError && <span style={{ display: 'block', color: 'red', fontSize: '12px', marginLeft: '15px', marginTop: '5px' }}> {value.msg}</span>}
    </>
  )
}


const Language = ({ error, name, label, value: lang_key, helperText, onChange, options }) => {
  const [value, setValue] = useState(null);
  const { languages } = useStore();

  const getLangByKey = async () => {
    if (lang_key) {
      let v = options.filter(f => f.value == lang_key);
      setValue({ value: v.length ? v[0].value : "", label: v.length ? v[0].label : "" })
    }
    else {
      setValue(null)
    }
  }
  useEffect(() => {
    getLangByKey()
  }, [lang_key]);
  const loadLanguage = async (inputValue = "", callback = null) => {
    callback(options.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={options}
      value={value}
      loadOptions={loadLanguage}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={label ? label : <LanguageConfig id="amenity.languagecode" />}
      helperText={helperText}
      error={error}
    />)
}


export { Country, City, Province, Currency, ContactNumber, ContactNum, Language }