import React, { useEffect, useState, useCallback } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { useStore } from "./Store";

const LanguageConfigFn = (id) => {
  const { currentAppLocale } = useStore()
  const [translation, setTranslation] = useState("") 
  const getTranslation = useCallback(() => {
    let id_ = "";
    if (currentAppLocale && currentAppLocale[id]) {
      id_ = currentAppLocale[id];
    }
    else {
      id_ = id.split(".");
      id_ = id_.length ? id_[id.length - 1] : id_.join("")
    }
    setTranslation(id_)
  }, [id, currentAppLocale])

  useEffect(() => {
    getTranslation()
  }, [id, currentAppLocale, getTranslation])

  return translation;
}

export { LanguageConfigFn }

const InjectMassage = (props) => <FormattedMessage {...props} />;
export default injectIntl(InjectMassage, { withRef: false });