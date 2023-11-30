import React, { useCallback, useContext, useMemo, useState } from "react";
import Modal from "react-modal";
import { useFieldArray, useForm } from "react-hook-form";

import styles from "./AddGameForm.module.css";
import CloseSvg from "../../svg/CloseSvg";
import {
  formatPrice,
  generateSerialKey,
  inputValidationMsg,
} from "../../utils/helpers";
import { Context } from "../../utils/GameShopContext";
import EtherLogoSvg from "../../svg/EtherLogoSvg";
import LoaderSvg from "../../svg/LoaderSvg";

Modal.setAppElement("body");

const AddGameForm = ({ isOpen, setIsOpen = () => {}, callback }) => {
  const { contract, account } = useContext(Context);
  const {
    handleSubmit,
    getValues,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "keys",
  });
  const [keyError, setKeyError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleModalClose = useCallback(() => {
    reset({ ...getValues(), name: "", price: null, keys: [] });
    setIsOpen(false);
  }, [setIsOpen, getValues, reset]);

  const addKeyField = useCallback(() => {
    const key = generateSerialKey(12);
    append({ key: key });
    setKeyError(false);
  }, [append]);

  const removeKeyField = useCallback(
    (index) => {
      remove(index);
    },
    [remove]
  );

  const addGame = useCallback(async () => {
    if (fields.length <= 0) {
      setKeyError(true);
      return;
    }
    setLoading(true);
    try {
      const arrayOfKeys = [];
      const data = { ...getValues() };
      Object.entries(data.keys).forEach(([, value]) => {
        arrayOfKeys.push(value.key);
      });

      const name = data.name.trim();

      await contract?.methods
        .addGame(name, formatPrice(Number(data.price)), arrayOfKeys)
        .send({ from: account });
      setLoading(false);
      handleModalClose();
      callback();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [
    fields.length,
    account,
    contract?.methods,
    getValues,
    callback,
    handleModalClose,
  ]);

  const renderKeyFields = useMemo(() => {
    return fields.map((field, index) => (
      <div key={field.id} className={styles.keyContainer}>
        <input
          {...register(`keys.${index}.key`)}
          className={styles.serialInput}
          disabled
        />
        <CloseSvg
          className={styles.remove}
          onClick={() => removeKeyField(index)}
        />
      </div>
    ));
  }, [fields, register, removeKeyField]);

  return (
    <Modal isOpen={isOpen} className={styles.wrapper}>
      {loading ? (
        <div className={styles.loadingMessage}>
          <LoaderSvg className={styles.loader} />
          <h1>Pending...</h1>
          <span>This window will close once the transaction is completed</span>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(addGame)}>
          <CloseSvg onClick={handleModalClose} className={styles.closeSvg} />
          <h1>Add a product</h1>
          <div className={styles.inputWrapper}>
            <span>Product name</span>
            <div>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Enter product name"
                className={[
                  styles.input,
                  errors?.name?.message ? styles.error : "",
                ].join(" ")}
              />
              {inputValidationMsg(errors?.name?.message, styles.errorMsg)}
            </div>
          </div>
          <div className={styles.priceWrapper}>
            <EtherLogoSvg />
            <div className={styles.inputContainer}>
              <input
                type="number"
                step="any"
                placeholder="0.0"
                {...register("price", { required: "Price is required" })}
                className={styles.priceInput}
              />
              {inputValidationMsg(errors?.price?.message, styles.errorMsg)}
            </div>
          </div>
          <div className={styles.serialKeys}>
            <span>Generate serial keys</span>
            {renderKeyFields}
          </div>
          {fields.length < 3 ? (
            <>
              <button
                onClick={addKeyField}
                type="button"
                className={styles.keyButton}
              >
                Add key
              </button>
              {keyError ? (
                <span className={styles.errorMsg}>
                  *At least 1 key needs to be generated
                </span>
              ) : null}
            </>
          ) : (
            <span>Serial key limit reached</span>
          )}
          <div className={styles.addButton}>
            <button type="submit" className={styles.submitButton}>
              <span>Submit</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddGameForm;
