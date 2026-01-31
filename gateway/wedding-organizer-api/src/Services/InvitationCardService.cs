using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Mappings;
using Microsoft.EntityFrameworkCore.Storage;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Repositories;
using WeddingOrganizerAPI.Services.Interfaces;

namespace WeddingOrganizerAPI.Services
{
    public class InvitationCardService : IInvitationCardService
    {
        private readonly IInvitationCardRepository _venueRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public InvitationCardService(
            IInvitationCardRepository venueRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _venueRepository = venueRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? venue, ApiError? err)> CreateAsync(CreateInvitationCardDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new InvitationCard
                {
                    Name = dto.Name,
                    Location = dto.Location,
                    Capacity = dto.Capacity,
                    Price = dto.Price,
                    Contact = dto.Contact,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _venueRepository.SaveAsync(entity);
                if (err != null || result == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(err));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                // var response = _mapper.Map<MessageVM>(result);
                var response = new MessageVM
                {
                    Value = result.Oid.ToString(),
                    Name = result.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? venue, ApiError? err)> UpdateAsync(Guid oid, UpdateInvitationCardDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingInvitationCard, findErr) = await _venueRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingInvitationCard == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("InvitationCard not found"));
                }

                // Update only if DTO fields are not null
                existingInvitationCard.Name = dto.Name ?? existingInvitationCard.Name;
                existingInvitationCard.Location = dto.Location ?? existingInvitationCard.Location;
                // existingInvitationCard.Capacity = dto.Capacity ?? existingInvitationCard.Capacity;
                // existingInvitationCard.Price = dto.Price ?? existingInvitationCard.Price;
                existingInvitationCard.Contact = dto.Contact ?? existingInvitationCard.Contact;
                existingInvitationCard.LastModifiedBy = userOid;
                existingInvitationCard.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _venueRepository.UpdateAsync(oid, existingInvitationCard);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = updatedResult.Oid.ToString(),
                    Name = updatedResult.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? venue, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (venue, findErr) = await _venueRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (venue == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("InvitationCard not found"));
                }

                var (deleted, removeErr) = await _venueRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = venue.Oid.ToString(),
                    Name = venue.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<InvitationCardVM> venues, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _venueRepository.FindAllAsync();
                if (err != null)
                    return (new List<InvitationCardVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<InvitationCardVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<InvitationCardVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(InvitationCardVM? venue, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _venueRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("InvitationCard not found"));

                var response = _mapper.Map<InvitationCardVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<InvitationCardVM> venues, ApiError? err)> FindPageAsync(InvitationCardFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _venueRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<InvitationCardVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<InvitationCardVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<InvitationCardVM>(), ApiError.InternalServerError(ex));
            }
        }
 

    }
}
