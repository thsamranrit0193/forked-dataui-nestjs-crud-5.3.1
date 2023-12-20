import { SerializeOptions } from '@dataui/crud';
import { DeleteDeviceResponseDto } from './delete-device-response.dto';

export const serialize: SerializeOptions = {
  delete: DeleteDeviceResponseDto,
};
