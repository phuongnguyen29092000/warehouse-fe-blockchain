import { Box } from "@mui/system";

const WaitingMessage = ({title}) => {
    const style = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        boxShadow: 24,
        overflow: 'hidden',
        borderRadius:'5px',
        zIndex: 99999999
    };

    return (
        <Box sx={style}>
            <div className='message-waiting'>
                <span>Vui lòng đợi trong giây lát</span>
                <h2 >{title}</h2>
            </div>
        </Box>
    )
}

export default WaitingMessage