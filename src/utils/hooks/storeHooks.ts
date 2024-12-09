import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

export const useTtcDispatch = useDispatch.withTypes<AppDispatch>();
export const useTtcSelector = useSelector.withTypes<RootState>();
