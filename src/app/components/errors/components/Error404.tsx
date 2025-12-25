import { FC } from 'react'
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from '../../../../_metronic/helpers'

const Error404: FC = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* begin::Title */}
      <h1 className='fw-bolder fs-2hx text-gray-900 mb-4'>Oops!</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className='fw-semibold fs-6 text-gray-500 mb-7'>We can't find that page.</div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className='mb-3'>
        <img
          src={toAbsoluteUrl('media/auth/404-error.png')}
          className='mw-100 mh-300px theme-light-show'
          alt=''
        />
        <img
          src={toAbsoluteUrl('media/auth/404-error-dark.png')}
          className='mw-100 mh-300px theme-dark-show'
          alt=''
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Button */}
      <div className="mb-0">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-primary"
        >
          Return
        </button>
      </div>
      {/* end::Button */}
    </>
  )
}

export { Error404 }
