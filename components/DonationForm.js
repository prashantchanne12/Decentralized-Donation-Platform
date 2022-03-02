import { Alert, Button, Input, InputWrapper } from '@mantine/core';
import React, { useState } from 'react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import contract from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const DonationForm = ({ minDonation, address, setOpened }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successs, setSuccess] = useState(false);
  const router = useRouter();

  if (parseFloat(minDonation) <= 100) {
    minDonation = '150';
  }

  const [value, setValue] = useState(minDonation);

  const clearErrorMessage = () => {
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(minDonation) < parseFloat(minDonation)) {
      setError(`Minimum donation is ${minDonation}`);
      clearErrorMessage();
      return;
    }

    const campaign = contract(address);

    setLoading(true);
    setError('');

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.donate().send({
        from: accounts[0],
        value: value,
      });
    } catch (err) {
      setLoading(false);
      setError(err.message);
      setSuccess(false);

      clearErrorMessage();

      return;
    }

    setSuccess(true);
    setLoading(false);
    setValue('');

    setTimeout(() => {
      setSuccess(false);
      setOpened(false);
      router.reload();
    }, 2000);
  };

  return (
    <>
      <form className='mt-5' onSubmit={onSubmit}>
        <InputWrapper label='Donation amount (Wei)' required>
          <Input
            invalid={error.length > 0}
            type='number'
            placeholder={`${minDonation} Wei is minimum donation `}
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputWrapper>
        <Button loading={loading} type='submit' className='bg-violet-600 my-4'>
          Donate
        </Button>
      </form>
      {error.length > 0 && (
        <Alert
          className='mt-1'
          icon={<XCircleIcon size={16} />}
          color='red'
          title='Something went wrong!'
        >
          {error}
        </Alert>
      )}
      {successs && (
        <Alert
          className='mt-1'
          icon={<CheckCircleIcon size={16} />}
          color='teal'
          title='Success'
        >
          Donated successfully!
        </Alert>
      )}
    </>
  );
};

export default DonationForm;
