import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import {
  Alert,
  Badge,
  Button,
  Input,
  InputWrapper,
  Progress,
} from '@mantine/core';
import React, { useState } from 'react';
import contract from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import Router from 'next/router';

import Supporter from '../../components/Supporter';

const Campaign = ({
  address,
  title,
  description,
  donated,
  totalDoners,
  minDonation,
  goal,
  complete,
  endAt,
  image,
  allDoners,
}) => {
  const progress = (donated / goal) * 100;

  if (minDonation <= parseFloat(100)) {
    minDonation = '150';
  }

  if (complete) {
    progress = 100;
    donated = goal;
  }

  const [value, setValue] = useState(minDonation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(value) < parseFloat(minDonation)) {
      setError(`Minimum donation is ${minDonation} Wei`);
      setTimeout(() => {
        setError('');
      }, 5000);
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
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setValue('');

    setTimeout(() => {
      setSuccess(false);
      Router.reload();
    }, 2000);
  };

  return (
    <div className='max-w-4xl mx-auto my-2 p-2'>
      <div className='grid md:grid-cols-2'>
        <div className='mt-3'>
          <h1 className='text-2xl font-semibold text-violet-600'>{title}</h1>
          <p className='text-gray-600'>{description}</p>
          <img
            src={image}
            className='w-96 h-64 object-cover rounded-md mt-3'
            alt={title}
          />
        </div>
        <div className='mt-16'>
          <div className=''>
            <p className='text-2xl font-semibold'>Goal</p>
            <p className='text-xl font-semibold text-violet-500'>{goal} Wei</p>
            <Progress value={progress} className='mt-4' />
            <p className='text-gray-500 text-sm font-semibold mt-1'>
              <span className='text-violet-500'>{donated}</span> raised by{' '}
              <span className='text-violet-500'>{totalDoners}</span> doners
            </p>
          </div>
          <div className='mt-12'>
            <p className='text-gray-600 font-semibold'>Created by</p>
            <p className='bg-violet-100 p-5 rounded text-gray-600 font-semibold mt-2'>
              {address}
            </p>
          </div>
        </div>
      </div>
      <hr className='my-5' />
      <div>
        <h1 className='text-xl font-semibold'>Donate now</h1>
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
          <Button
            disabled={complete}
            loading={loading}
            type='submit'
            className='bg-violet-600 my-4'
          >
            Donate
          </Button>
        </form>

        {error && (
          <Alert
            className=''
            icon={<XCircleIcon size={16} />}
            color='red'
            title='Something went wrong!'
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            className=''
            icon={<CheckCircleIcon size={16} />}
            color='teal'
            title='Success!'
          >
            Donated successfully to {address}
          </Alert>
        )}
      </div>
      {allDoners?.length > 0 && (
        <div className='mt-2'>
          <h2 className='text-gray-600 font-semibold '>Supporters ❤️</h2>
          {allDoners.map((donor, index) => (
            <Supporter key={index} donor={donor} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaign;

export async function getServerSideProps(context) {
  const { id } = context.query;

  const campaign = contract(id);

  const summary = await campaign.methods.getSummary().call();
  const allDoners = await campaign.methods.geAllDoners().call();

  return {
    props: {
      address: id,
      title: summary[0],
      description: summary[1],
      donated: summary[2],
      totalDoners: summary[3],
      minDonation: summary[4],
      goal: summary[5],
      complete: summary[6],
      endAt: summary[7],
      image: summary[8],
      allDoners: allDoners,
    },
  };
}
